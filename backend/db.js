const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function testDatabaseConnection() {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log("=================================");
        console.log("✅ PostgreSQL connected successfully");
        console.log("📌 Database:", process.env.DB_NAME);
        console.log("🕒 Server time:", result.rows[0].now);
        console.log("=================================");

        return true;
    } catch (error) {
        console.error("=================================");
        console.error("❌ PostgreSQL connection failed");
        console.error("Error:", error.message);
        console.error("=================================");

        return false;
    }
}

module.exports = {
    pool,
    testDatabaseConnection,
};