
require("dotenv").config();
const pool = require("./src/config/db");

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");

    console.log("Koneksi Supabase berhasil!");
    console.log("Waktu server PostgreSQL:", result.rows[0].server_time);
  } catch (error) {
    console.error("Koneksi database gagal:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
