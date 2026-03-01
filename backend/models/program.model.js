module.exports = (sequelize, Sequelize) => {
  const Programs = sequelize.define("programs", {
    program_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    program_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    program_acronym: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    department_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Programs;
};
