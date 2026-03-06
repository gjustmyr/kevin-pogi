module.exports = (sequelize, Sequelize) => {
	const RequirementSubmission = sequelize.define("requirement_submissions", {
		submission_id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		assignment_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			comment: "Reference to course_assignments",
		},
		requirement_type: {
			type: Sequelize.ENUM(
				"Instructional Materials",
				"Student Class Attendance Sheet",
				"Acknowledgement Receipt of Syllabus",
				"Acknowledgement Receipt of Exam",
				"Midterm, Final Exam, and TQS",
				"Student Exam (Highest-Middle-Lowest)",
				"Key to Correction of Midterm and Final Exam",
				"Report of Grades",
				"Class Record",
			),
			allowNull: false,
		},
		file_path: {
			type: Sequelize.STRING(500),
			allowNull: false,
			comment: "Path to uploaded file",
		},
		file_name: {
			type: Sequelize.STRING(255),
			allowNull: false,
			comment: "Original file name",
		},
		file_size: {
			type: Sequelize.INTEGER,
			comment: "File size in bytes",
		},
		submission_date: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		},
		status: {
			type: Sequelize.ENUM("pending", "cleared", "returned"),
			defaultValue: "pending",
			comment:
				"pending=awaiting review, cleared=approved, returned=needs revision",
		},
		dean_remarks: {
			type: Sequelize.TEXT,
			allowNull: true,
			comment: "Dean comments when clearing or returning",
		},
		validated_by: {
			type: Sequelize.INTEGER,
			allowNull: true,
			comment: "Dean user_id who validated",
		},
		validated_date: {
			type: Sequelize.DATE,
			allowNull: true,
		},
	});

	return RequirementSubmission;
};
