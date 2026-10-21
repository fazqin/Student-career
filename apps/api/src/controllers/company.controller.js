const pool = require("../config/db");

// GET semua company
const getAllCompanies = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                id,
                name,
                industry,
                size,
                location,
                brand_color,
                website,
                created_at,
                updated_at
            FROM companies
            ORDER BY id ASC;
        `;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        return next(error);
    }
};


// GET company berdasarkan id
const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM companies WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            const error = new Error("Company Not Found");
            error.status = 404;
            return next(error);
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
};


// POST Company
const postAllCompany = async (req, res, next) => {
    try {
        const { name, industry, size, location, brand_color, website } = req.body;
        const query = `
            INSERT INTO companies (name, industry, size, location, brand_color, website)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            name,
            industry || "Technology",
            size || "50-200",
            location || "Indonesia",
            brand_color || "#14b8a6",
            website || null
        ];
        const result = await pool.query(query, values);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
};


// PUT Company berdasarkan id
const putCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, industry, size, location, brand_color, website } = req.body;
        const query = `
            UPDATE companies
            SET 
                name = COALESCE($1, name),
                industry = COALESCE($2, industry),
                size = COALESCE($3, size),
                location = COALESCE($4, location),
                brand_color = COALESCE($5, brand_color),
                website = COALESCE($6, website),
                updated_at = NOW()
            WHERE id = $7
            RETURNING *;
        `;
        const result = await pool.query(query, [name, industry, size, location, brand_color, website, id]);
        if (result.rows.length === 0) {
            const error = new Error("Company Not Found");
            error.status = 404;
            return next(error);
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return next(error);
    }
};


// DELETE Company berdasarkan id
const delCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM companies WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) {
            const error = new Error("Company Not Found");
            error.status = 404;
            return next(error);
        }
        return res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getAllCompanies,
    getCompanyById,
    postAllCompany,
    putCompanyById,
    delCompanyById
};