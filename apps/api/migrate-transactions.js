require("dotenv").config();
const pool = require("./src/config/db");

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("Memulai migrasi database...");
    await client.query("BEGIN");

    // 1. Tambah kolom tier, kuota konsultasi, dan masa aktif ke tabel users
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'Free',
      ADD COLUMN IF NOT EXISTS consultation_quota INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_expires_at TIMESTAMP WITH TIME ZONE;
    `);
    console.log("✓ Kolom tier & consultation_quota berhasil ditambahkan ke tabel users.");

    // 2. Buat tabel transactions untuk bukti transaksi
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tier VARCHAR(20) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'completed',
        consultation_added INT NOT NULL DEFAULT 0,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✓ Tabel transactions berhasil dibuat.");

    await client.query("COMMIT");
    console.log("Migrasi selesai dan berhasil di-COMMIT!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migrasi gagal (ROLLED BACK):", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
