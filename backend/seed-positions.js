const db = require("./models");

async function seedPositions() {
  try {
    console.log("Seeding position templates...");

    const positions = [
      {
        position_name: "President",
        hierarchy_level: 1,
        max_allowed: 1,
        description: "Organization President",
      },
      {
        position_name: "Vice President",
        hierarchy_level: 2,
        max_allowed: 1,
        description: "Organization Vice President",
      },
      {
        position_name: "Secretary",
        hierarchy_level: 3,
        max_allowed: 1,
        description: "Organization Secretary",
      },
      {
        position_name: "Treasurer",
        hierarchy_level: 3,
        max_allowed: 1,
        description: "Organization Treasurer",
      },
      {
        position_name: "Auditor",
        hierarchy_level: 3,
        max_allowed: 1,
        description: "Organization Auditor",
      },
      {
        position_name: "P.R.O.",
        hierarchy_level: 3,
        max_allowed: 2,
        description: "Public Relations Officer",
      },
      {
        position_name: "Business Manager",
        hierarchy_level: 3,
        max_allowed: 1,
        description: "Business Manager",
      },
      {
        position_name: "Multimedia Director",
        hierarchy_level: 3,
        max_allowed: 1,
        description: "Multimedia Director",
      },
      {
        position_name: "COMDRRM Head",
        hierarchy_level: 3,
        max_allowed: 1,
        description: "Committee on Disaster Risk Reduction Management Head",
      },
      {
        position_name: "Multimedia Member",
        hierarchy_level: 4,
        max_allowed: 999,
        description: "Member under Multimedia Director",
      },
      {
        position_name: "COMDRRM Member",
        hierarchy_level: 4,
        max_allowed: 2,
        description: "Member under COMDRRM Head",
      },
      {
        position_name: "1st Year Representative",
        hierarchy_level: 4,
        max_allowed: 999,
        description: "First Year Representative",
      },
      {
        position_name: "2nd Year Representative",
        hierarchy_level: 4,
        max_allowed: 999,
        description: "Second Year Representative",
      },
      {
        position_name: "3rd Year Representative",
        hierarchy_level: 4,
        max_allowed: 999,
        description: "Third Year Representative",
      },
      {
        position_name: "General Member",
        hierarchy_level: 5,
        max_allowed: 999,
        description: "General organization member",
      },
    ];

    for (const position of positions) {
      await db.OrganizationPositionTemplate.findOrCreate({
        where: { position_name: position.position_name },
        defaults: position,
      });
    }

    console.log("✓ Position templates seeded successfully!");

    // Verify
    const count = await db.OrganizationPositionTemplate.count();
    console.log(`Total positions in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seedPositions();
