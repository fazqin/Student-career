// Naik 1 tingkat keluar dari folder 'jobs' ke 'src/config/db'
const pool = require("../config/db");

async function cleanupOldWithdrawnApplications() {
  try {
    console.log("[CLEANUP] Memeriksa lamaran Withdrawn yang kedaluwarsa (>30 hari)...");
    const result = await pool.query(`
      DELETE FROM applications 
      WHERE status = 'Withdrawn' 
        AND updated_at < NOW() - INTERVAL '30 days';
    `);
    if (result.rowCount > 0) {
      console.log(`[CLEANUP] Sukses menghapus ${result.rowCount} riwayat Withdrawn lama.`);
    }
  } catch (error) {
    console.error("[CLEANUP] Gagal membersihkan riwayat:", error.message);
  }
}

// Wajib diexport agar bisa dipanggil oleh server.js
module.exports = { cleanupOldWithdrawnApplications };
