
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function register(req, res, next) {
    const client = await pool.connect();

    try {
        const {
            email,
            password,
            full_name,
            university,
            major,
            semester,
        } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        await client.query("BEGIN");

        const existingUser = await client.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const userResult = await client.query(
            `INSERT INTO users (email, password_hash)
             VALUES ($1, $2)
             RETURNING id, email, role, created_at`,
            [normalizedEmail, passwordHash]
        );

        const user = userResult.rows[0];

        await client.query(
            `INSERT INTO profiles
                (user_id, full_name, university, major, semester)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                user.id,
                full_name.trim(),
                university.trim(),
                major.trim(),
                Number(semester),
            ]
        );

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m",
            }
        );

        await client.query("COMMIT");

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil.",
            data: {
                user,
                profile: {
                    full_name: full_name.trim(),
                    university: university.trim(),
                    major: major.trim(),
                    semester: Number(semester),
                },
            },
        });
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            return next(rollbackError);
        }

        if (error.code === "23505" && error.constraint === "users_email_key") {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar.",
            });
        }

        return next(error);
    } finally {
        client.release();
    }
}


async function getMe(req, res, next) {
    try {
        const result = await pool.query(
            `SELECT
                u.id,
                u.email,
                u.role,
                u.created_at,
                p.full_name,
                p.university,
                p.major,
                p.semester,
                p.graduation_year,
                p.headline,
                p.github_url,
                p.linkedin_url,
                p.portfolio_url
             FROM users u
             LEFT JOIN profiles p ON p.user_id = u.id
             WHERE u.id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            return res.status(401).json({
                success: false,
                message: "Akun tidak ditemukan. Silakan login kembali.",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: result.rows[0],
            },
        });
    } catch (error) {
        return next(error);
    }
}

function logout(req, res) {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return res.status(200).json({
        success: true,
        message: "Logout berhasil.",
    });
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const result = await pool.query(
            `SELECT id, email, password_hash, role, created_at
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah.",
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah.",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m",
            }
        );

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "Login berhasil.",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at,
                },
            },
        });
    } catch (error) {
        return next(error);
    }
}


module.exports = {
    register,
    login,
    getMe,
    logout,
};
