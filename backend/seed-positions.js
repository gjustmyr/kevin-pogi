require("dotenv").config();
const db = require("./models");

async function seedPositions() {
	try {
		await db.sequelize.sync();

		const positions = [
			{
				position_name: "President",
				hierarchy_level: 1,
				max_allowed: 1,
				description: "Organization President",
			},
			{
				position_name: "Vice President",
				hierarchy_level: 2,
				max_allowed: 1,
				description: "Organization Vice President",
			},
			{
				position_name: "Secretary",
				hierarchy_level: 3,
				max_allowed: 1,
				description: "Organization Secretary",
			},
			{
				position_name: "Treasurer",
				hierarchy_level: 3,
				max_allowed: 1,
				description: "Organization Treasurer",
			},
			{
				position_name: "Auditor",
				hierarchy_level: 3,
				max_allowed: 1,
				description: "Organization Auditor",
			},
			{
				position_name: "Public Relations Officer",
				hierarchy_level: 3,
				max_allowed: 1,
				description: "PRO",
			},
			{
				position_name: "Business Manager",
				hierarchy_level: 3,
				max_allowed: 1,
				description: "Business Manager",
			},
			{
				position_name: "Committee Head",
				hierarchy_level: 4,
				max_allowed: 10,
				description: "Committee Head",
			},
			{
				position_name: "Committee Member",
				hierarchy_level: 4,
				max_allowed: 50,
				description: "Committee Member",
			},
			{
				position_name: "Member",
				hierarchy_level: 5,
				max_allowed: 500,
				description: "Regular Member",
			},
		];

		for (const position of positions) {
			const [positionRecord, created] =
				await db.OrganizationPositionTemplate.findOrCreate({
					where: { position_name: position.position_name },
					defaults: position,
				});

			if (created) {
				console.log(`✓ Created position: ${position.position_name}`);
			} else {
				console.log(`- Position already exists: ${position.position_name}`);
			}
		}

		console.log("\n✓ Position templates seeded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding positions:", error);
		process.exit(1);
	}
}

seedPositions();
