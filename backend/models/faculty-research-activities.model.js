module.exports = (sequelize, Sequelize) => {
  const FacultyResearchActivities = sequelize.define(
    "faculty_research_activities",
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
          "Research Seminar",
          "Research Workshop",
          "Research Training",
          "Research Conference",
          "Research Presentation",
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
      role: {
        type: Sequelize.ENUM(
          "Participant",
          "Presenter",
          "Researcher",
          "Facilitator",
          "Organizer",
        ),
        defaultValue: "Participant",
      },
      research_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
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

  return FacultyResearchActivities;
};
