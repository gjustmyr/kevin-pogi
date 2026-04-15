module.exports = (sequelize, Sequelize) => {
  const FacultySeminarsTrainings = sequelize.define(
    "faculty_seminars_trainings",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      faculty_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          "Seminar",
          "Training",
          "Conference",
          "Workshop",
          "Webinar",
          "Symposium",
        ),
        allowNull: false,
      },
      organizer: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      venue: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      date_from: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      date_to: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      number_of_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM(
          "Participant",
          "Speaker",
          "Resource Person",
          "Facilitator",
          "Organizer",
        ),
        defaultValue: "Participant",
      },
      certificate_file: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return FacultySeminarsTrainings;
};
