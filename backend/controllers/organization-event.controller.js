const db = require("../models");
const csv = require("csv-parser");
const { Readable } = require("stream");

// Get all events for an organization
exports.getEvents = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;

    const events = await db.sequelize.query(
      `SELECT 
        e.*,
        COUNT(DISTINCT a.id) as attendee_count
      FROM organization_events e
      LEFT JOIN organization_event_attendees a ON e.id = a.event_id
      WHERE e.organization_id = ?
      GROUP BY e.id
      ORDER BY e.date_implemented DESC`,
      {
        replacements: [organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Get single event with details
exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;

    const [event] = await db.sequelize.query(
      `SELECT * FROM organization_events WHERE id = ? AND organization_id = ?`,
      {
        replacements: [id, organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get SDGs
    const sdgs = await db.sequelize.query(
      `SELECT sdg_number FROM organization_event_sdgs WHERE event_id = ?`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    // Get Guests
    const guests = await db.sequelize.query(
      `SELECT * FROM organization_event_guests WHERE event_id = ?`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    // Get Attendee count
    const [{ count }] = await db.sequelize.query(
      `SELECT COUNT(*) as count FROM organization_event_attendees WHERE event_id = ?`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    res.json({
      ...event,
      sdgs: sdgs.map((s) => s.sdg_number),
      guests,
      attendee_count: count,
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;
    const {
      title,
      date_implemented,
      status,
      start_time,
      end_time,
      description,
      sdgs,
      guests,
    } = req.body;

    // Insert event
    const [result] = await db.sequelize.query(
      `INSERT INTO organization_events 
        (organization_id, title, date_implemented, status, start_time, end_time, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          organizationId,
          title,
          date_implemented,
          status || "Planned",
          start_time,
          end_time,
          description,
        ],
        type: db.sequelize.QueryTypes.INSERT,
      },
    );

    const eventId = result;

    // Insert SDGs
    if (sdgs && sdgs.length > 0) {
      for (const sdg of sdgs) {
        await db.sequelize.query(
          `INSERT INTO organization_event_sdgs (event_id, sdg_number) VALUES (?, ?)`,
          {
            replacements: [eventId, sdg],
            type: db.sequelize.QueryTypes.INSERT,
          },
        );
      }
    }

    // Insert Guests
    if (guests && guests.length > 0) {
      for (const guest of guests) {
        await db.sequelize.query(
          `INSERT INTO organization_event_guests (event_id, guest_name, guest_title, guest_affiliation) 
          VALUES (?, ?, ?, ?)`,
          {
            replacements: [
              eventId,
              guest.guest_name,
              guest.guest_title,
              guest.guest_affiliation,
            ],
            type: db.sequelize.QueryTypes.INSERT,
          },
        );
      }
    }

    res
      .status(201)
      .json({ message: "Event created successfully", id: eventId });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;
    const {
      title,
      date_implemented,
      status,
      start_time,
      end_time,
      description,
      sdgs,
      guests,
    } = req.body;

    // Check ownership
    const [event] = await db.sequelize.query(
      `SELECT * FROM organization_events WHERE id = ? AND organization_id = ?`,
      {
        replacements: [id, organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update event
    await db.sequelize.query(
      `UPDATE organization_events 
      SET title = ?, date_implemented = ?, status = ?, start_time = ?, end_time = ?, description = ?
      WHERE id = ?`,
      {
        replacements: [
          title,
          date_implemented,
          status,
          start_time,
          end_time,
          description,
          id,
        ],
        type: db.sequelize.QueryTypes.UPDATE,
      },
    );

    // Update SDGs - delete and re-insert
    await db.sequelize.query(
      `DELETE FROM organization_event_sdgs WHERE event_id = ?`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.DELETE,
      },
    );

    if (sdgs && sdgs.length > 0) {
      for (const sdg of sdgs) {
        await db.sequelize.query(
          `INSERT INTO organization_event_sdgs (event_id, sdg_number) VALUES (?, ?)`,
          {
            replacements: [id, sdg],
            type: db.sequelize.QueryTypes.INSERT,
          },
        );
      }
    }

    // Update Guests - delete and re-insert
    await db.sequelize.query(
      `DELETE FROM organization_event_guests WHERE event_id = ?`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.DELETE,
      },
    );

    if (guests && guests.length > 0) {
      for (const guest of guests) {
        await db.sequelize.query(
          `INSERT INTO organization_event_guests (event_id, guest_name, guest_title, guest_affiliation) 
          VALUES (?, ?, ?, ?)`,
          {
            replacements: [
              id,
              guest.guest_name,
              guest.guest_title,
              guest.guest_affiliation,
            ],
            type: db.sequelize.QueryTypes.INSERT,
          },
        );
      }
    }

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Error updating event" });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;

    // Check ownership
    const [event] = await db.sequelize.query(
      `SELECT * FROM organization_events WHERE id = ? AND organization_id = ?`,
      {
        replacements: [id, organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await db.sequelize.query(`DELETE FROM organization_events WHERE id = ?`, {
      replacements: [id],
      type: db.sequelize.QueryTypes.DELETE,
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};

// Get attendees for an event
exports.getAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;

    // Check ownership
    const [event] = await db.sequelize.query(
      `SELECT * FROM organization_events WHERE id = ? AND organization_id = ?`,
      {
        replacements: [id, organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendees = await db.sequelize.query(
      `SELECT * FROM organization_event_attendees WHERE event_id = ? ORDER BY student_name`,
      {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    res.json(attendees);
  } catch (error) {
    console.error("Get attendees error:", error);
    res.status(500).json({ message: "Error fetching attendees" });
  }
};

// Upload attendees via CSV
exports.uploadAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user.organization_id;

    // Check ownership
    const [event] = await db.sequelize.query(
      `SELECT * FROM organization_events WHERE id = ? AND organization_id = ?`,
      {
        replacements: [id, organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const errors = [];
    let rowNumber = 1;

    // Parse CSV
    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csv())
      .on("data", (data) => {
        rowNumber++;

        // Validate required fields
        if (!data.sr_code || !data.student_name) {
          errors.push(
            `Row ${rowNumber}: Missing required fields (sr_code, student_name)`,
          );
          return;
        }

        results.push({
          sr_code: data.sr_code.trim(),
          student_name: data.student_name.trim(),
          year_level: data.year_level?.trim() || null,
          section: data.section?.trim() || null,
          program: data.program?.trim() || null,
          department: data.department?.trim() || null,
        });
      })
      .on("end", async () => {
        if (errors.length > 0) {
          return res
            .status(400)
            .json({ message: "CSV validation errors", errors });
        }

        try {
          let inserted = 0;
          let skipped = 0;

          for (const attendee of results) {
            try {
              await db.sequelize.query(
                `INSERT INTO organization_event_attendees 
                  (event_id, sr_code, student_name, year_level, section, program, department)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                {
                  replacements: [
                    id,
                    attendee.sr_code,
                    attendee.student_name,
                    attendee.year_level,
                    attendee.section,
                    attendee.program,
                    attendee.department,
                  ],
                  type: db.sequelize.QueryTypes.INSERT,
                },
              );
              inserted++;
            } catch (err) {
              if (err.original?.code === "ER_DUP_ENTRY") {
                skipped++;
              } else {
                throw err;
              }
            }
          }

          res.json({
            message: "Attendees uploaded successfully",
            inserted,
            skipped,
            total: results.length,
          });
        } catch (error) {
          console.error("Insert attendees error:", error);
          res.status(500).json({ message: "Error inserting attendees" });
        }
      })
      .on("error", (error) => {
        console.error("CSV parse error:", error);
        res.status(500).json({ message: "Error parsing CSV file" });
      });
  } catch (error) {
    console.error("Upload attendees error:", error);
    res.status(500).json({ message: "Error uploading attendees" });
  }
};

// Download attendee template CSV
exports.downloadTemplate = (req, res) => {
  const csvContent =
    "sr_code,student_name,year_level,section,program,department\n" +
    "21-12345,Juan Dela Cruz,3rd Year,BSIT-3A,BS Information Technology,CICS\n" +
    "21-12346,Maria Santos,2nd Year,BSCS-2B,BS Computer Science,CICS";

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=attendee-template.csv",
  );
  res.send(csvContent);
};

// Delete attendee
exports.deleteAttendee = async (req, res) => {
  try {
    const { id, attendeeId } = req.params;
    const organizationId = req.user.organization_id;

    // Check ownership
    const [event] = await db.sequelize.query(
      `SELECT * FROM organization_events WHERE id = ? AND organization_id = ?`,
      {
        replacements: [id, organizationId],
        type: db.sequelize.QueryTypes.SELECT,
      },
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await db.sequelize.query(
      `DELETE FROM organization_event_attendees WHERE id = ? AND event_id = ?`,
      {
        replacements: [attendeeId, id],
        type: db.sequelize.QueryTypes.DELETE,
      },
    );

    res.json({ message: "Attendee deleted successfully" });
  } catch (error) {
    console.error("Delete attendee error:", error);
    res.status(500).json({ message: "Error deleting attendee" });
  }
};
