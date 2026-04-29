const db = require("../models");
const { Op } = require("sequelize");

// Get organization dashboard statistics
exports.getOrganizationDashboard = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Get total organizations
    const totalOrganizations = await db.Organization.count({
      where: { department: dean.department },
    });

    // Get organizations with member counts
    const organizationsWithMembers = await db.Organization.findAll({
      where: { department: dean.department },
      attributes: ["organization_id", "organization_name"],
      include: [
        {
          model: db.OrganizationMember,
          attributes: [],
        },
      ],
      group: ["organizations.organization_id"],
      raw: true,
    });

    const totalMembers = await db.OrganizationMember.count({
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    // Get document statistics
    const totalDocuments = await db.OrganizationDocument.count({
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    const pendingDocuments = await db.OrganizationDocument.count({
      where: { status: "pending" },
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    const approvedDocuments = await db.OrganizationDocument.count({
      where: { status: "approved" },
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    const rejectedDocuments = await db.OrganizationDocument.count({
      where: { status: "rejected" },
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    // Get total advisers
    const totalAdvisers = await db.OrganizationAdviser.count({
      where: { is_active: true },
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    // Get event statistics
    const approvedEvents = await db.OrganizationEvent.count({
      where: { approval_status: "approved" },
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    const pendingEvents = await db.OrganizationEvent.count({
      where: { approval_status: "pending" },
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: [],
        },
      ],
    });

    // Get recent documents
    const recentDocuments = await db.OrganizationDocument.findAll({
      limit: 5,
      order: [["submitted_date", "DESC"]],
      include: [
        {
          model: db.Organization,
          where: { department: dean.department },
          attributes: ["organization_id", "organization_name"],
        },
        {
          model: db.DocumentType,
          attributes: ["document_type_id", "type_name"],
        },
      ],
    });

    // Get organizations with their stats
    const organizationStats = await db.Organization.findAll({
      where: { department: dean.department },
      attributes: ["organization_id", "organization_name"],
      include: [
        {
          model: db.Faculty,
          attributes: ["first_name", "middle_name", "last_name"],
        },
        {
          model: db.OrganizationMember,
          attributes: ["member_id"],
        },
        {
          model: db.OrganizationDocument,
          attributes: ["document_id", "status"],
        },
      ],
    });

    res.json({
      statistics: {
        totalOrganizations,
        totalMembers,
        totalDocuments,
        pendingDocuments,
        approvedDocuments,
        rejectedDocuments,
        totalAdvisers,
        approvedEvents,
        pendingEvents,
      },
      recentDocuments,
      organizationStats,
    });
  } catch (error) {
    console.error("Get organization dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
