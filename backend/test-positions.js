const db = require("./models");

async function testPositions() {
  try {
    console.log("Testing position templates...");

    const positions = await db.OrganizationPositionTemplate.findAll({
      order: [
        ["hierarchy_level", "ASC"],
        ["position_name", "ASC"],
      ],
    });

    console.log(`Found ${positions.length} positions:`);
    positions.forEach((pos) => {
      console.log(`- ${pos.position_name} (Level ${pos.hierarchy_level})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testPositions();
