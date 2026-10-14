// const applications = [
//     { 
//         id: 1, 
//         company_id: "PT OTW KAYA", 
//         position: "QA", 
//         status: "Applied"
//     },
//     { 
//         id: 2, 
//         user_id:1,
//         company_id: "Tech Corp", 
//         position: "Backend Developer", 
//         status: "Interview"
//     },
//     {
//         id: 3,
//         company: "Creative Agency",
//         position: "UI/UX Designer",
//         status: "Rejected"
//     }
// ];
const pool = require("../config/db");

// GET semua

const getAllApplications = async (req, res) => {
    try {
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
            FROM applications AS a
            ORDER BY a.id ASC;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            message: "Applications retrieved successfully",
            data: result.rows
        });
    } catch (error) {
        console.error("Error retrieving applications:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// GET spesifik by id

const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                message: "Application ID must be a positive integer"
            });
        }

        const query = `
            SELECT
                id,
                user_id,
                position_id,
                status,
                priority,
                applied_date,
                deadline,
                notes,
                created_at,
                updated_at
            FROM applications
            WHERE id = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json({
            message: "Application retrieved successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error retrieving application:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};


// POST tambah lamaran baru

const createApplication = async (req, res) => {
    try {
        const {
            user_id,
            position_id,
            status = "Applied",
            priority = "Medium",
            deadline = null,
            notes = null,
        } = req.body;

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
            user_id,
            position_id,
            status,
            priority,
            deadline,
            notes,
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: "Application created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error creating application:", error.message);

        // Foreign key tidak ditemukan
        if (error.code === "23503") {
            return res.status(400).json({
                message: "user_id or position_id does not reference an existing record",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// PUT update seluruh data

const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Application ID must be a positive integer",
            });
        }

        const {
            user_id,
            position_id,
            status,
            priority,
            deadline = null,
            notes = null,
        } = req.body;

        const query = `
            UPDATE applications
            SET
                user_id = $1,
                position_id = $2,
                status = $3,
                priority = $4,
                deadline = $5,
                notes = $6,
                updated_at = NOW()
            WHERE id = $7
            RETURNING *;
        `;

        const values = [
            user_id,
            position_id,
            status,
            priority,
            deadline,
            notes,
            id,
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        return res.status(200).json({
            message: "Application updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating application:", error.message);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "user_id or position_id does not reference an existing record",
            });
        }

        if (error.code === "23514") {
            return res.status(400).json({
                message: "Invalid status or priority",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// PATCH update sebagian -> status

const patchApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
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
                message: "At least one valid field must be provided",
            });
        }

        updates.push("updated_at = NOW()");
        values.push(id);

        const query = `
            UPDATE applications
            SET ${updates.join(", ")}
            WHERE id = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        return res.status(200).json({
            message: "Application updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error patching application:", error.message);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "position_id does not reference an existing position",
            });
        }

        if (error.code === "23514") {
            return res.status(400).json({
                message: "Invalid status or priority",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// DELETE hapus lamaran

const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Application ID must be a positive integer",
            });
        }

        const query = `
            DELETE FROM applications
            WHERE id = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        return res.status(200).json({
            message: "Application deleted successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error deleting application:", error.message);

        if (error.code === "23503") {
            return res.status(409).json({
                message: "Application cannot be deleted because it is referenced by another record",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
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