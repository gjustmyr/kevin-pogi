module.exports = (sequelize, Sequelize) => {
  const Section = sequelize.define("sections", {
    section_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    section_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    year_level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    semester: {
      type: Sequelize.ENUM("1st Sem", "2nd Sem", "Midterm 1", "Midterm 2"),
      allowNull: false,
    },
    program_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Section;
};
