const { dbConfig } = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Department = require("./department.model")(sequelize, Sequelize);
const Programs = require("./program.model")(sequelize, Sequelize);
const Section = require("./section.model")(sequelize, Sequelize);
const Dean = require("./dean.model")(sequelize, Sequelize);
const Faculty = require("./faculty.model")(sequelize, Sequelize);
const Organization = require("./organization.model")(sequelize, Sequelize);
const User = require("./user.model")(sequelize, Sequelize);
const Admin = require("./admin.model")(sequelize, Sequelize);
const Course = require("./course.model")(sequelize, Sequelize);
const AcademicYear = require("./academic-year.model")(sequelize, Sequelize);
const CourseAssignment = require("./course-assignment.model")(sequelize, Sequelize);
const RequirementSubmission = require("./requirement-submission.model")(sequelize, Sequelize);

/* User → Admin (1:1) */
User.hasOne(Admin, {
	foreignKey: "user_id",
});
Admin.belongsTo(User, {
	foreignKey: "user_id",
});

/* User → Dean (1:1) */
User.hasOne(Dean, {
	foreignKey: "user_id",
});
Dean.belongsTo(User, {
	foreignKey: "user_id",
});

/* User → Faculty (1:1) */
User.hasOne(Faculty, {
	foreignKey: "user_id",
});
Faculty.belongsTo(User, {
	foreignKey: "user_id",
});

/* User → Organization (1:1) */
User.hasOne(Organization, {
	foreignKey: "user_id",
});
Organization.belongsTo(User, {
	foreignKey: "user_id",
});

/* Department → Dean (1:1 - one dean per department) */
Department.hasOne(Dean, {
	foreignKey: "department_id",
});
Dean.belongsTo(Department, {
	foreignKey: "department_id",
});

/* Department → Programs (1:Many) */
Department.hasMany(Programs, {
	foreignKey: "department_id",
});
Programs.belongsTo(Department, {
	foreignKey: "department_id",
});

/* Programs → Sections (1:Many) */
Programs.hasMany(Section, {
	foreignKey: "program_id",
});
Section.belongsTo(Programs, {
	foreignKey: "program_id",
});

/* Department → Faculty (1:Many) */
Department.hasMany(Faculty, {
	foreignKey: "department_id",
});
Faculty.belongsTo(Department, {
	foreignKey: "department_id",
});

/* Department → Organizations (1:Many) */
Department.hasMany(Organization, {
	foreignKey: "department_id",
});
Organization.belongsTo(Department, {
	foreignKey: "department_id",
});

/* Faculty → Organizations (1:1 - one faculty assigned to organization) */
Faculty.hasOne(Organization, {
	foreignKey: "faculty_id",
});
Organization.belongsTo(Faculty, {
	foreignKey: "faculty_id",
});

/* Department → Courses (1:Many) */
Department.hasMany(Course, {
	foreignKey: "department_id",
});
Course.belongsTo(Department, {
	foreignKey: "department_id",
});

/* CourseAssignment Relationships */
Faculty.hasMany(CourseAssignment, {
	foreignKey: "faculty_id",
});
CourseAssignment.belongsTo(Faculty, {
	foreignKey: "faculty_id",
});

Course.hasMany(CourseAssignment, {
	foreignKey: "course_id",
});
CourseAssignment.belongsTo(Course, {
	foreignKey: "course_id",
});

Section.hasMany(CourseAssignment, {
	foreignKey: "section_id",
});
CourseAssignment.belongsTo(Section, {
	foreignKey: "section_id",
});

AcademicYear.hasMany(CourseAssignment, {
	foreignKey: "academic_year_id",
});
CourseAssignment.belongsTo(AcademicYear, {
	foreignKey: "academic_year_id",
});

/* RequirementSubmission Relationships */
CourseAssignment.hasMany(RequirementSubmission, {
	foreignKey: "assignment_id",
});
RequirementSubmission.belongsTo(CourseAssignment, {
	foreignKey: "assignment_id",
});

db.Department = Department;
db.Program = Programs;
db.Programs = Programs;
db.Section = Section;
db.Dean = Dean;
db.Faculty = Faculty;
db.Organization = Organization;
db.User = User;
db.Admin = Admin;
db.Course = Course;
db.AcademicYear = AcademicYear;
db.CourseAssignment = CourseAssignment;
db.RequirementSubmission = RequirementSubmission;

module.exports = db;
