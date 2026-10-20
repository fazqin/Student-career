
const pool = require("../config/db");

// GET semua profiles (endpoint lama, tetap dipertahankan)
const getAllProfiles = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id,
                p.user_id,
                u.email,
                p.full_name,
                p.university,
                p.major,
                p.semester,
                p.graduation_year,
                p.location,
                p.headline,
                p.github_url,
                p.linkedin_url,
                p.portfolio_url
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            ORDER BY p.full_name ASC
        `);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// PUT profil milik pengguna yang sedang login
const updateMyProfile = async (req, res, next) => {
    try {
        const {
            full_name,
            university,
            major,
            semester,
            graduation_year,
            headline,
            github_url,
            linkedin_url,
            portfolio_url,
            location
        } = req.body;

        const result = await pool.query(
            `UPDATE profiles
             SET
                full_name = $1,
                university = $2,
                major = $3,
                semester = $4,
                graduation_year = $5,
                headline = $6,
                github_url = $7,
                linkedin_url = $8,
                portfolio_url = $9,
                location = $10,
                updated_at = NOW()
             WHERE user_id = $11
             RETURNING
                id,
                user_id,
                full_name,
                university,
                major,
                semester,
                graduation_year,
                headline,
                github_url,
                linkedin_url,
                portfolio_url,
                location,
                updated_at`,
            [
                full_name.trim(),
                university.trim(),
                major.trim(),
                Number(semester),
                graduation_year === "" || graduation_year == null
                    ? null
                    : Number(graduation_year),
                headline ?? null,
                github_url ?? null,
                linkedin_url ?? null,
                portfolio_url ?? null,
                location ?? null,
                req.user.id
            ]
        );

        if (result.rowCount === 0) {
            const error = new Error("Profile Not Found");
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { profile: result.rows[0] }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProfiles,
    updateMyProfile
};
