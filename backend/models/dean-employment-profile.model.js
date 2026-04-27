module.exports = (sequelize, Sequelize) => {
  const DeanEmploymentProfile = sequelize.define(
    "dean_employment_profile",
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
      position_title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      employment_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      date_from: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      date_to: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      is_current: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      monthly_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      salary_grade: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      is_government_service: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return DeanEmploymentProfile;
};
