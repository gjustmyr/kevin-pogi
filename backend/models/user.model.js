module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define("users", {
		user_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		role: {
			type: Sequelize.ENUM(
				"superadmin",
				"dean",
				"faculty",
				"admin",
				"organization",
			),
			allowNull: false,
			defaultValue: "faculty",
		},
	});

	return User;
};
