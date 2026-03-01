module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("courses", {
    course_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    course_code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    course_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    department_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Course;
};
