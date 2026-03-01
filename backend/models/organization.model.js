module.exports = (sequelize, Sequelize) => {
	const Organization = sequelize.define("organizations", {
		organization_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		organization_name: {
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
		faculty_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique: true,
		},
	});

	return Organization;
};
