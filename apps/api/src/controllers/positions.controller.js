const positions = [
    {
        id: 1,
        name: "ML Engineer",
        industry: "Telecommunication",
        location: "Bandung",
        InternStatus: "Paid"
    },
    {
        id: 2,
        name: "Data Scientist",
        industry: "Technology",
        location: "Jakarta",
        status: "Unpaid"
    },
    {
        id: 3,
        name: "Frontend Developer Intern",
        industry: "Technology",
        location: "Jakarta Selatan",
        status: "Paid"
    }

];

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
const postAllPosition = (req, res) => {
    const {name, industry, location, status} = req.body;

    const newPosition = {
        id: positions.length + 1,
        company_id,
        name,
        industry,
        location,
        status
    }
    positions.push(newPosition);
    res.status(201).json(newPosition);
}

// PUT Position by id
const putPositionById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const position = positions.find(
        (item) => item.id === id
    )
    const {company_id, name, industry, location, status} = req.body;

    if (position) {
        position.company_id = company_id;
        position.name = name;
        position.industry = industry;
        position.location = location;
        position.status = status;
        res.json(position);
    } else {
        res.status(404).json({
            error: "Position Not Found"
        });
    }
}

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
const delPositionById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const positionIndex = positions.findIndex(
        (item) => item.id === id
    );

    if (positionIndex !== -1) {
        positions.splice(positionIndex, 1);
        res.status(200).json({
            message: "Position deleted successfully"
        });
    } else {
        res.status(404).json({
            error: "Position Not Found"
        });
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





