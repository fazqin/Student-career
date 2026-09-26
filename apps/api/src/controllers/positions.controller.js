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
        InternStatus: "Unpaid"
    }
];

// GET semua positions
const getAllPositions = (req, res) => {
    res.json(positions);
};

// GET position berdasarkan id
const getPositionById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const position = positions.find(
        (item) => item.id === id
    );

    if (position) {
        res.json(position);
    } else {
        res.status(404).json({
            error: "Position Not Found"
        });
    }
};

// POST Position
const postAllPosition = (req, res) => {
    const {name, industry, location, InternStatus} = req.body;

    const newPosition = {
        id: positions.length + 1,
        name,
        industry,
        location,
        InternStatus
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
    const {name, industry, location, InternStatus} = req.body;

    if (position) {
        position.name = name;
        position.industry = industry;
        position.location = location;
        position.InternStatus = InternStatus;
        res.json(position);
    } else {
        res.status(404).json({
            error: "Position Not Found"
        });
    }
}

// PATCH Position by id
const patchPositionById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const position = positions.find(
        (item) => item.id === id
    )
    const {name, industry, location, InternStatus} = req.body;

    if (position) {
        if (name) position.name = name;
        if (industry) position.industry = industry;
        if (location) position.location = location;
        if (InternStatus) position.InternStatus = InternStatus;
        res.json(position);
    } else {
        res.status(404).json({
            error: "Position Not Found"
        });
    }
}

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
    patchPositionById,
    delPositionById
};