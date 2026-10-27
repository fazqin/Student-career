
const pool = require("../config/db");

// GET semua


const getAllApplications = async (req, res, next) => {
    try {
        const { id: userId, role } = req.user;

        const query = `
            SELECT
                a.id,
                a.user_id,
                a.position_id,
                a.status,
                a.priority,
                a.applied_date,
                a.deadline AS application_deadline,
                a.notes,
                a.created_at,
                a.updated_at,
                p.title AS position_title,
                p.deadline AS position_deadline,
                c.name AS company_name,
                c.industry AS company_industry
            FROM applications a
            JOIN positions p ON p.id = a.position_id
            JOIN companies c ON c.id = p.company_id
            WHERE ($1 = 'admin' OR a.user_id = $2)
            ORDER BY a.id ASC;
        `;

        const result = await pool.query(query, [role, userId]);

        return res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        return next(error);
    }
};



// GET spesifik by id


const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Application ID must be a positive integer"
            });
        }

        const query = `
            SELECT
                a.id,
                a.user_id,
                a.position_id,
                a.status,
                a.priority,
                a.applied_date,
                a.deadline,
                a.notes,
                a.created_at,
                a.updated_at
            FROM applications a
            WHERE a.id = $1
              AND ($2 = 'admin' OR a.user_id = $3);
        `;

        const result = await pool.query(query, [id, role, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application retrieved successfully",
            data: result.rows[0]
        });
    } catch (error) {
        return next(error);
    }
};



// POST tambah lamaran baru


const createApplication = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const {
            position_id,
            status = "Applied",
            priority = "Medium",
            deadline = null,
            notes = null,
        } = req.body;

        const checkExisting = await pool.query(`
        SELECT a.id, a.status, p.deadline 
        FROM positions p
        LEFT JOIN applications a ON a.position_id = p.id AND a.user_id = $1
        WHERE p.id = $2`, 
        [userId, position_id]);

        if (checkExisting.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Posisi tidak ditemukan." });
}
        const { id: existingAppId, status: existingStatus} = checkExisting.rows[0];

        // 2. Validasi Deadline Pendaftaran
            if (deadline && new Date(deadline) < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "Pendaftaran untuk posisi ini sudah ditutup karena telah melewati batas deadline.",
                });
            }
            // 3. Jika sudah pernah melamar:
            if (existingAppId) {
                // KONDISI A: Status Withdrawn -> RE-ACTIVATE KEMBALI
                if (existingStatus === "Withdrawn") {
                    const reactivateQuery = `
                        UPDATE applications
                        SET 
                            status = 'Applied',
                            priority = $1,
                            deadline = $2,
                            notes = $3,
                            applied_date = NOW(),
                            updated_at = NOW()
                        WHERE id = $4
                        RETURNING *;
                    `;
                    const result = await pool.query(reactivateQuery, [
                        priority,
                        deadline,
                        notes,
                        existingAppId
                    ]);
                    return res.status(200).json({
                        success: true,
                        message: "Lamaran berhasil diaktifkan kembali (Re-applied).",
                        data: result.rows[0],
                    });
                }
                // KONDISI B: Status masih aktif (Applied, Assessment, Interview, dll.)
                return res.status(409).json({
                    success: false,
                    message: "Anda sudah memiliki lamaran aktif untuk posisi ini.",
                });
            }


        const query = `
            INSERT INTO applications (
                user_id,
                position_id,
                status,
                priority,
                deadline,
                notes
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            userId,
            position_id,
            status,
            priority,
            deadline,
            notes,
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            success: true,
            message: "Application created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                success: false,
                message: "position_id does not reference an existing position",
            });
        }

        if (error.code === "23514") {
            return res.status(400).json({
                success: false,
                message: "Invalid status or priority",
            });
        }

        return next(error);
    }
};



// PUT update seluruh data


const updateApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Application ID must be a positive integer",
            });
        }

        const {
            position_id,
            status,
            priority,
            deadline = null,
            notes = null,
        } = req.body;

        const query = `
            UPDATE applications
            SET
                position_id = $1,
                status = $2,
                priority = $3,
                deadline = $4,
                notes = $5,
                updated_at = NOW()
            WHERE id = $6
              AND ($7 = 'admin' OR user_id = $8)
            RETURNING *;
        `;

        const values = [
            position_id,
            status,
            priority,
            deadline,
            notes,
            id,
            role,
            userId,
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23503" || error.code === "23514") {
            return res.status(400).json({
                success: false,
                message: "Invalid position, status, or priority",
            });
        }

        return next(error);
    }
};



// PATCH update sebagian -> status


const patchApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Application ID must be a positive integer",
            });
        }

        const allowedFields = [
            "position_id",
            "status",
            "priority",
            "deadline",
            "notes",
        ];

        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                values.push(req.body[field]);
                updates.push(`${field} = $${values.length}`);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one valid field must be provided",
            });
        }

        updates.push("updated_at = NOW()");

        values.push(id);
        const idParam = values.length;

        values.push(role);
        const roleParam = values.length;

        values.push(userId);
        const userParam = values.length;

        const query = `
            UPDATE applications
            SET ${updates.join(", ")}
            WHERE id = $${idParam}
              AND ($${roleParam} = 'admin' OR user_id = $${userParam})
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23503" || error.code === "23514") {
            return res.status(400).json({
                success: false,
                message: "Invalid position, status, or priority",
            });
        }

        return next(error);
    }
};



// DELETE hapus lamaran


const deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Application ID must be a positive integer",
            });
        }

        const query = `
            DELETE FROM applications
            WHERE id = $1
              AND ($2 = 'admin' OR user_id = $3)
            RETURNING *;
        `;

        const result = await pool.query(query, [id, role, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully",
            data: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({
                success: false,
                message: "Application cannot be deleted because it is referenced by another record",
            });
        }

        return next(error);
    }
};



module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    patchApplication,
    deleteApplication
};