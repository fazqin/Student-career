require("dotenv").config();
const pool = require("./src/config/db");

async function testRawSqlTransaction() {
  const client = await pool.connect();
  try {
    console.log("=== PENGUJIAN RAW SQL TRANSACTION ===");

    // 1. Ambil 1 user sample dari database
    const userRes = await pool.query("SELECT id, email, role, tier, consultation_quota FROM users LIMIT 1");
    if (userRes.rows.length === 0) {
      console.log("Tidak ada user di database untuk diuji.");
      return;
    }
    const testUser = userRes.rows[0];
    console.log("User Uji:", {
      id: testUser.id,
      email: testUser.email,
      tier_sebelum: testUser.tier || "Free",
      kuota_sebelum: testUser.consultation_quota || 0,
    });

    // 2. Skenario Sukses: BEGIN -> INSERT INTO transactions -> UPDATE users -> COMMIT
    console.log("\n[SKENARIO 1] Menguji BEGIN ... COMMIT:");
    await client.query("BEGIN");

    const insertRes = await client.query(`
      INSERT INTO transactions (user_id, tier, amount, payment_method, status, consultation_added, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [
      testUser.id,
      "Premium",
      51945,
      "qris",
      "completed",
      2,
      JSON.stringify({ note: "Test Raw Query Transaction" }),
    ]);
    console.log("✓ Step 1: Insert transactions berhasil! ID:", insertRes.rows[0].id);

    const updateRes = await client.query(`
      UPDATE users
      SET 
        tier = $1,
        consultation_quota = COALESCE(consultation_quota, 0) + $2,
        tier_expires_at = NOW() + INTERVAL '30 days',
        updated_at = NOW()
      WHERE id = $3
      RETURNING id, tier, consultation_quota, tier_expires_at;
    `, ["Premium", 2, testUser.id]);
    console.log("✓ Step 2: Update users berhasil! Tier baru:", updateRes.rows[0].tier, "Kuota:", updateRes.rows[0].consultation_quota);

    await client.query("COMMIT");
    console.log("✓ Step 3: COMMIT sukses! Perubahan tersimpan secara atomik ke database.");

    // 3. Skenario Rollback: BEGIN -> INSERT -> SIMULATED ERROR -> ROLLBACK
    console.log("\n[SKENARIO 2] Menguji BEGIN ... ROLLBACK saat terjadi kesalahan:");
    await client.query("BEGIN");
    console.log("✓ BEGIN dieksekusi.");

    await client.query(`
      INSERT INTO transactions (user_id, tier, amount, payment_method, status, consultation_added)
      VALUES ($1, 'Ultimate', 2999999, 'bca', 'pending', 999);
    `, [testUser.id]);
    console.log("✓ Step 1: Draft transaksi dimasukkan sementara.");

    console.log("! Mensimulasikan kegagalan sistem sebelum commit...");
    throw new Error("Simulasi error server: Foreign Key / Network failure!");
  } catch (error) {
    console.log("✓ Catch blok menangkap error:", error.message);
    await client.query("ROLLBACK");
    console.log("✓ ROLLBACK dieksekusi! Semua perubahan sementara di Skenario 2 berhasil dibatalkan.");
  } finally {
    client.release();
    await pool.end();
    console.log("\n=== PENGUJIAN SELESAI ===");
  }
}

testRawSqlTransaction();
