const pool = require("../config/db");

// Konfigurasi Tier & Harga (sesuai spesifikasi di frontend)
const TIER_CONFIG = {
    Premium: {
        price: 51945,
        consultationQuota: 2,
        label: "Pro Booster",
    },
    Ultimate: {
        price: 2999999,
        consultationQuota: 999, // 999 menandakan Unlimited konsultasi
        label: "VIP Concierge",
    },
};

// Metode pembayaran yang aktif secara riil (Domestik)
const ACTIVE_DOMESTIC_METHODS = ["qris", "gopay", "bca"];

// Metode pembayaran internasional (hanya pemanis/showcase)
const ELITE_SHOWCASE_METHODS = ["visa", "mastercard", "amex", "bitcoin"];

/**
 * POST /api/subscriptions/subscribe
 * Memproses langganan user menggunakan Raw SQL Database Transaction (BEGIN, COMMIT, ROLLBACK).
 */
const subscribeTier = async (req, res, next) => {
    // 1. Dapatkan client khusus dari pool untuk isolasi transaksi
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const { tier, paymentMethod } = req.body;

        // 2. Validasi input tier
        if (!tier || !TIER_CONFIG[tier]) {
            return res.status(400).json({
                success: false,
                message: "Pilihan tier tidak valid. Pilih antara 'Premium' atau 'Ultimate'.",
            });
        }

        const normalizedMethod = (paymentMethod || "").toLowerCase().trim();

        // 3. Validasi metode pembayaran:
        // Jika user memilih metode Elite, tolak dengan edukasi bahwa ini hanya pemanis
        if (ELITE_SHOWCASE_METHODS.includes(normalizedMethod)) {
            return res.status(400).json({
                success: false,
                message: `Metode pembayaran ${normalizedMethod.toUpperCase()} (Elite) saat ini hanya sebagai showcase/pemanis. Silakan gunakan metode Domestik (QRIS, GoPay, atau Bank Transfer BCA) untuk memproses pembayaran riil.`,
            });
        }

        // Cek apakah metode domestik valid
        if (!ACTIVE_DOMESTIC_METHODS.includes(normalizedMethod)) {
            return res.status(400).json({
                success: false,
                message: "Metode pembayaran tidak didukung. Silakan pilih QRIS, GoPay, atau BCA.",
            });
        }

        const config = TIER_CONFIG[tier];

        // =========================================================================
        // MULAI RAW DATABASE TRANSACTION
        // =========================================================================
        console.log(`[TRANSACTION] Memulai transaksi pembelian Tier ${tier} untuk user ID: ${userId}`);
        await client.query("BEGIN");

        // QUERY 1: Catat entri pembayaran ke tabel transactions
        const insertTransactionSql = `
            INSERT INTO transactions (
                user_id,
                tier,
                amount,
                payment_method,
                status,
                consultation_added,
                metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, user_id, tier, amount, payment_method, status, consultation_added, created_at;
        `;

        const transactionResult = await client.query(insertTransactionSql, [
            userId,
            tier,
            config.price,
            normalizedMethod,
            "completed",
            config.consultationQuota,
            JSON.stringify({
                gateway: "CareerTrack Domestic Instant Gateway",
                client_ip: req.ip || "127.0.0.1",
                processed_at: new Date().toISOString(),
            }),
        ]);

        const recordedTransaction = transactionResult.rows[0];

        // QUERY 2: Update profil tier & kuota user di tabel users
        const updateUserSql = `
            UPDATE users
            SET
                tier = $1::varchar,
                consultation_quota = CASE 
                    WHEN $1::varchar = 'Ultimate' THEN 999 
                    ELSE COALESCE(consultation_quota, 0) + $2 
                END,
                tier_expires_at = NOW() + INTERVAL '30 days',
                updated_at = NOW()
            WHERE id = $3
            RETURNING id, email, role, tier, consultation_quota, tier_expires_at;
        `;

        const userUpdateResult = await client.query(updateUserSql, [
            tier,
            config.consultationQuota,
            userId,
        ]);

        if (userUpdateResult.rows.length === 0) {
            // Jika user tidak ditemukan, batalkan transaksi dengan throw error
            throw new Error(`User dengan ID ${userId} tidak ditemukan. Membatalkan transaksi.`);
        }

        const updatedUser = userUpdateResult.rows[0];

        // QUERY 3: COMMIT transaksi secara atomik (semua query berhasil)
        await client.query("COMMIT");
        console.log(`[TRANSACTION] Transaksi sukses di-COMMIT. ID Transaksi: ${recordedTransaction.id}`);

        return res.status(200).json({
            success: true,
            message: `Pembayaran berhasil! Akun Anda kini aktif pada Tier ${tier}.`,
            data: {
                transaction: recordedTransaction,
                user: updatedUser,
                rawSqlTransaction: {
                    status: "COMMITTED",
                    queriesExecuted: [
                        "BEGIN",
                        "INSERT INTO transactions ...",
                        "UPDATE users SET tier = ..., consultation_quota = ...",
                        "COMMIT",
                    ],
                },
            },
        });
    } catch (error) {
        // Jika ada kesalahan pada salah satu query, ROLLBACK semua perubahan
        console.error("[TRANSACTION] Terjadi kesalahan! Melakukan ROLLBACK...", error.message);
        try {
            await client.query("ROLLBACK");
        } catch (rollbackErr) {
            console.error("[TRANSACTION] Gagal saat ROLLBACK:", rollbackErr.message);
        }
        return next(error);
    } finally {
        // Selalu lepaskan koneksi kembali ke pool
        client.release();
    }
};

/**
 * GET /api/subscriptions/current
 * Mengambil status tier langganan dan sisa kuota konsultasi user saat ini.
 */
const getCurrentSubscription = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                id, 
                email, 
                role, 
                COALESCE(tier, 'Free') AS tier, 
                COALESCE(consultation_quota, 0) AS consultation_quota, 
                tier_expires_at
            FROM users 
            WHERE id = $1;
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan.",
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * GET /api/subscriptions/history
 * Mengambil riwayat transaksi pembayaran user.
 */
const getTransactionHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                id, 
                tier, 
                amount, 
                payment_method, 
                status, 
                consultation_added, 
                created_at 
            FROM transactions 
            WHERE user_id = $1 
            ORDER BY created_at DESC;
        `;

        const result = await pool.query(query, [userId]);

        return res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    subscribeTier,
    getCurrentSubscription,
    getTransactionHistory,
};
