module.exports = (sequelize, Sequelize) => {
	const Faculty = sequelize.define("faculties", {
		faculty_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		employee_id: {
			type: Sequelize.STRING(5),
			allowNull: false,
		},
		first_name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		middle_name: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		last_name: {
			type: Sequelize.STRING,
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
		contact_number: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		department_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique: true,
		},
		clearance_status: {
			type: Sequelize.ENUM("pending", "cleared", "withholding"),
			defaultValue: "pending",
			comment:
				"pending=incomplete requirements, cleared=all requirements approved, withholding=has returned requirements",
		},
		clearance_remarks: {
			type: Sequelize.TEXT,
			allowNull: true,
			comment: "Dean's remarks on faculty clearance status",
		},
		clearance_date: {
			type: Sequelize.DATE,
			allowNull: true,
			comment: "Date when faculty was cleared or status changed",
		},
	});

	return Faculty;
};
