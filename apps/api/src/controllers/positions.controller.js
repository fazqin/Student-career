
const pool = require("../config/db");

// GET semua positions

const getAllPositions = async (req, res) => {
    try {
        const query = `
            SELECT
                p.id,
                p.company_id,
                p.title,
                p.description,
                p.location,
                p.intern_status,
                p.work_type,
                p.salary_range,
                p.deadline,
                p.created_at,
                p.updated_at,
                c.name AS company_name,
                c.industry,
                c.size AS company_size,
                c.brand_color,
                c.website
            FROM positions AS p
            JOIN companies AS c
                ON c.id = p.company_id
            ORDER BY p.id ASC;
        `;

        const result = await pool.query(query);

        return res.status(200).json({
            message: "Positions retrieved successfully",
            data: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving positions:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getPositionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Position ID must be a positive integer",
            });
        }

        const query = `
            SELECT
                p.id,
                p.company_id,
                p.title,
                p.description,
                p.location,
                p.intern_status,
                p.work_type,
                p.salary_range,
                p.deadline,
                p.created_at,
                p.updated_at,
                c.name AS company_name,
                c.industry,
                c.size AS company_size,
                c.brand_color,
                c.website
            FROM positions AS p
            JOIN companies AS c
                ON c.id = p.company_id
            WHERE p.id = $1;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Position not found",
            });
        }

        return res.status(200).json({
            message: "Position retrieved successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Error retrieving position:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


// POST Position
const postAllPosition = async (req, res, next) => {
    try {
        const {
            company_id,
            companyId,
            title,
            description,
            location,
            intern_status,
            internStatus,
            work_type,
            type,
            salary_range,
            salaryRange,
            deadline
        } = req.body;
        const targetCompanyId = company_id || companyId;
        const targetTitle = title;
        const targetDescription = description || "";
        const targetLocation = location;
        const targetInternStatus = intern_status || internStatus || "Paid";
        const targetWorkType = work_type || type || "Internship";
        const targetSalaryRange = salary_range || salaryRange || null;
        const targetDeadline = deadline ? new Date(deadline) : null;
        const query = `
            INSERT INTO positions (
                company_id,
                title,
                description,
                location,
                intern_status,
                work_type,
                salary_range,
                deadline
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            targetCompanyId,
            targetTitle,
            targetDescription,
            targetLocation,
            targetInternStatus,
            targetWorkType,
            targetSalaryRange,
            targetDeadline
        ];
        const result = await pool.query(query, values);
        return res.status(201).json({
            message: "Position created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating position:", error.message);
        return next(error);
    }
};

// PUT Position by id
const putPositionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            company_id,
            companyId,
            title,
            description,
            location,
            intern_status,
            internStatus,
            work_type,
            type,
            salary_range,
            salaryRange,
            deadline
        } = req.body;
        const query = `
            UPDATE positions
            SET
                company_id = COALESCE($1, company_id),
                title = COALESCE($2, title),
                description = COALESCE($3, description),
                location = COALESCE($4, location),
                intern_status = COALESCE($5, intern_status),
                work_type = COALESCE($6, work_type),
                salary_range = COALESCE($7, salary_range),
                deadline = COALESCE($8, deadline),
                updated_at = NOW()
            WHERE id = $9
            RETURNING *;
        `;
        const values = [
            company_id || companyId,
            title,
            description,
            location,
            intern_status || internStatus,
            work_type || type,
            salary_range || salaryRange,
            deadline ? new Date(deadline) : null,
            id
        ];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Position not found" });
        }
        return res.status(200).json({
            message: "Position updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating position:", error.message);
        return next(error);
    }
};

// PATCH Position by id
// const patchPositionById = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const position = positions.find(
//         (item) => item.id === id
//     )
//     const {name, industry, location, InternStatus} = req.body;

//     if (position) {
//         if (name) position.name = name;
//         if (industry) position.industry = industry;
//         if (location) position.location = location;
//         if (InternStatus) position.InternStatus = InternStatus;
//         res.json(position);
//     } else {
//         res.status(404).json({
//             error: "Position Not Found"
//         });
//     }
// }

// DELETE Position by id
const delPositionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM positions WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Position not found" });
        }
        return res.status(200).json({ message: "Position deleted successfully" });
    } catch (error) {
        console.error("Error deleting position:", error.message);
        return next(error);
    }
};

module.exports = {
    getAllPositions,
    getPositionById,
    postAllPosition,
    putPositionById,
    //patchPositionById,
    delPositionById
};





