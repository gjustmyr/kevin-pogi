module.exports = (sequelize, Sequelize) => {
  const DeanAwards = sequelize.define(
    "dean_award",
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
      award_title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      awarding_body: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      date_received: {
        type: Sequelize.DATEONLY,
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

  return DeanAwards;
};
