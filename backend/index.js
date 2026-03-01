const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const db = require("./models");

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth.routes");
const superadminRoutes = require("./routes/superadmin.routes");
const deanRoutes = require("./routes/dean.routes");
const facultyRoutes = require("./routes/faculty.routes");
const organizationRoutes = require("./routes/organization.routes");
const adminRoutes = require("./routes/admin.routes");
const deanManagementRoutes = require("./routes/dean-management.routes");
const departmentRoutes = require("./routes/department.routes");
const programRoutes = require("./routes/program.routes");
const dropdownRoutes = require("./routes/dropdown.routes");

// Superadmin specific routes
const academicYearRoutes = require("./routes/academic-year.routes");
const superadminDeanRoutes = require("./routes/superadmin-dean.routes");
const superadminFacultyRoutes = require("./routes/superadmin-faculty.routes");
const superadminDepartmentRoutes = require("./routes/superadmin-department.routes");
const superadminProgramRoutes = require("./routes/superadmin-program.routes");
const superadminSectionRoutes = require("./routes/superadmin-section.routes");

// Dean specific routes
const deanFacultyRoutes = require("./routes/dean-faculty.routes");
const deanCourseRoutes = require("./routes/dean-course.routes");
const deanSectionRoutes = require("./routes/dean-section.routes");
const deanProgramRoutes = require("./routes/dean-program.routes");
const deanOrganizationRoutes = require("./routes/dean-organization.routes");
const deanCourseAssignmentRoutes = require("./routes/dean-course-assignment.routes");
const deanRequirementRoutes = require("./routes/dean-requirement.routes");

// Faculty specific routes
const facultyRequirementRoutes = require("./routes/faculty-requirement.routes");

app.use("/api/auth", authRoutes);
app.use("/api/superadmin/dashboard", superadminRoutes);
app.use("/api/dean/dashboard", deanRoutes);
app.use("/api/faculty/dashboard", facultyRoutes);
app.use("/api/organization/dashboard", organizationRoutes);
app.use("/api/admin/dashboard", adminRoutes);
app.use("/api/admin/deans", deanManagementRoutes);
app.use("/api/admin/departments", departmentRoutes);
app.use("/api/admin/programs", programRoutes);
app.use("/api/dropdown", dropdownRoutes);

// Superadmin module routes
app.use("/api/superadmin/academic-years", academicYearRoutes);
app.use("/api/superadmin/deans", superadminDeanRoutes);
app.use("/api/superadmin/faculty", superadminFacultyRoutes);
app.use("/api/superadmin/departments", superadminDepartmentRoutes);
app.use("/api/superadmin/programs", superadminProgramRoutes);
app.use("/api/superadmin/sections", superadminSectionRoutes);

// Dean module routes
app.use("/api/dean/faculty", deanFacultyRoutes);
app.use("/api/dean/courses", deanCourseRoutes);
app.use("/api/dean/sections", deanSectionRoutes);
app.use("/api/dean/programs", deanProgramRoutes);
app.use("/api/dean/organizations", deanOrganizationRoutes);
app.use("/api/dean/course-assignments", deanCourseAssignmentRoutes);
app.use("/api/dean/requirements", deanRequirementRoutes);

// Faculty module routes
app.use("/api/faculty/requirements", facultyRequirementRoutes);

app.get("/api/hello", (req, res) => {
	res.json({ message: "Hello from the backend!" });
});

const PORT = process.env.PORT || 3000;

// Test database connection and sync models
db.sequelize
	.authenticate()
	.then(() => {
		console.log("Database connection successful!");
		// Sync models with database (creates tables if they don't exist)
		return db.sequelize.sync();
	})
	.then(() => {
		console.log("Database tables synced!");
	})
	.catch((err) => {
		console.error("Database error:", err.message);
	});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
