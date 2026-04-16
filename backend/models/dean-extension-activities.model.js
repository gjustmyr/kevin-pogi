module.exports = (sequelize, Sequelize) => {
  const DeanExtensionActivities = sequelize.define(
    "dean_extension_activity",
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
      description: {
        type: Sequelize.TEXT,
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

  return DeanExtensionActivities;
};
