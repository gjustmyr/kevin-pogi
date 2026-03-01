module.exports = (sequelize, Sequelize) => {
  const CourseAssignment = sequelize.define("course_assignments", {
    assignment_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    faculty_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    section_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    academic_year_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    semester: {
      type: Sequelize.ENUM("1st Sem", "2nd Sem", "Midterm 1", "Midterm 2"),
      allowNull: false,
    },
    assigned_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "Dean user_id who made the assignment",
    },
    assigned_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    status: {
      type: Sequelize.ENUM("active", "completed", "archived"),
      defaultValue: "active",
    },
  });

  return CourseAssignment;
};
