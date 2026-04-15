module.exports = (sequelize, Sequelize) => {
  const FacultyExtensionActivities = sequelize.define(
    "faculty_extension_activities",
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
      activity_title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      activity_type: {
        type: Sequelize.ENUM(
          "Community Service",
          "Outreach Program",
          "Training/Seminar",
          "Consultancy",
          "Technical Assistance",
          "Other",
        ),
        allowNull: false,
      },
      beneficiary: {
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
          "Coordinator",
          "Member",
          "Resource Person",
          "Facilitator",
          "Participant",
        ),
        defaultValue: "Participant",
      },
      number_of_beneficiaries: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      documentation_file: {
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

  return FacultyExtensionActivities;
};
