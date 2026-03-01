module.exports = (sequelize, Sequelize) => {
  const Department = sequelize.define("departments", {
    department_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    department_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    department_acronym: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Department;
};
