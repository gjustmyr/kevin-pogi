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
const CourseAssignment = require("./course-assignment.model")(
	sequelize,
	Sequelize,
);
const RequirementSubmission = require("./requirement-submission.model")(
	sequelize,
	Sequelize,
);
const FacultyCredential = require("./faculty-credential.model")(
	sequelize,
	Sequelize,
);
const CredentialCertificate = require("./credential-certificate.model")(
	sequelize,
	Sequelize,
);
const PersonalDataSheet = require("./personal-data-sheet.model")(
	sequelize,
	Sequelize,
);
const PDSChild = require("./pds-child.model")(sequelize, Sequelize);
const PDSEducation = require("./pds-education.model")(sequelize, Sequelize);
const PDSEligibility = require("./pds-eligibility.model")(
	sequelize,
	Sequelize,
);
const PDSWorkExperience = require("./pds-work-experience.model")(
	sequelize,
	Sequelize,
);
const PDSVoluntaryWork = require("./pds-voluntary-work.model")(
	sequelize,
	Sequelize,
);
const PDSTraining = require("./pds-training.model")(sequelize, Sequelize);
const PDSOtherInfo = require("./pds-other-info.model")(sequelize, Sequelize);
const PDSReference = require("./pds-reference.model")(sequelize, Sequelize);

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

/* FacultyCredential Relationships */
Faculty.hasOne(FacultyCredential, {
	foreignKey: "faculty_id",
});
FacultyCredential.belongsTo(Faculty, {
	foreignKey: "faculty_id",
});

/* CredentialCertificate Relationships */
FacultyCredential.hasMany(CredentialCertificate, {
	foreignKey: "credential_id",
	as: "credential_certificates",
});
CredentialCertificate.belongsTo(FacultyCredential, {
	foreignKey: "credential_id",
});

/* PersonalDataSheet Relationships */
Faculty.hasOne(PersonalDataSheet, {
	foreignKey: "faculty_id",
});
PersonalDataSheet.belongsTo(Faculty, {
	foreignKey: "faculty_id",
});

/* PDS Children Relationships */
PersonalDataSheet.hasMany(PDSChild, {
	foreignKey: "pds_id",
	as: "children",
});
PDSChild.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS Education Relationships */
PersonalDataSheet.hasMany(PDSEducation, {
	foreignKey: "pds_id",
	as: "education",
});
PDSEducation.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS Eligibility Relationships */
PersonalDataSheet.hasMany(PDSEligibility, {
	foreignKey: "pds_id",
	as: "eligibilities",
});
PDSEligibility.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS Work Experience Relationships */
PersonalDataSheet.hasMany(PDSWorkExperience, {
	foreignKey: "pds_id",
	as: "work_experiences",
});
PDSWorkExperience.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS Voluntary Work Relationships */
PersonalDataSheet.hasMany(PDSVoluntaryWork, {
	foreignKey: "pds_id",
	as: "voluntary_works",
});
PDSVoluntaryWork.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS Training Relationships */
PersonalDataSheet.hasMany(PDSTraining, {
	foreignKey: "pds_id",
	as: "trainings",
});
PDSTraining.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS Other Info Relationships */
PersonalDataSheet.hasMany(PDSOtherInfo, {
	foreignKey: "pds_id",
	as: "other_info",
});
PDSOtherInfo.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
});

/* PDS References Relationships */
PersonalDataSheet.hasMany(PDSReference, {
	foreignKey: "pds_id",
	as: "references",
});
PDSReference.belongsTo(PersonalDataSheet, {
	foreignKey: "pds_id",
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
db.FacultyCredential = FacultyCredential;
db.CredentialCertificate = CredentialCertificate;
db.PersonalDataSheet = PersonalDataSheet;
db.PDSChild = PDSChild;
db.PDSEducation = PDSEducation;
db.PDSEligibility = PDSEligibility;
db.PDSWorkExperience = PDSWorkExperience;
db.PDSVoluntaryWork = PDSVoluntaryWork;
db.PDSTraining = PDSTraining;
db.PDSOtherInfo = PDSOtherInfo;
db.PDSReference = PDSReference;

module.exports = db;
