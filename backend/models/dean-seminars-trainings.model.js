module.exports = (sequelize, Sequelize) => {
  const DeanSeminarsTrainings = sequelize.define(
    "dean_seminars_training",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dean_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      organizer: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      date_from: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      date_to: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      venue: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      file_path: {
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

  return DeanSeminarsTrainings;
};
