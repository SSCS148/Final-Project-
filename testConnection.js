const sequelize = require("./server/config/database.js"); // Chemin correct basé sur votre structure de projet

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();
