
const VALID_STATUSES = [
    "Wishlist",
    "Applied",
    "Assessment",
    "Interview",
    "Offer",
    "Rejected",
    "Withdrawn",
];

const VALID_PRIORITIES = ["Low", "Medium", "High"];

const validateApplicationBody = (req, res, next) => {
    const {
        user_id,
        position_id,
        status = "Applied",
        priority = "Medium",
        deadline = null,
        notes = null,
    } = req.body;

    // Field wajib
    if (!user_id || position_id === undefined || position_id === null) {
        return res.status(400).json({
            message: "user_id and position_id are required",
        });
    }

    // Validasi format UUID
    const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (typeof user_id !== "string" || !uuidPattern.test(user_id)) {
        return res.status(400).json({
            message: "user_id must be a valid UUID",
        });
    }

    // Validasi position_id sebagai integer positif
    if (
        !(
            (typeof position_id === "number" && Number.isSafeInteger(position_id)) ||
            (typeof position_id === "string" && /^\d+$/.test(position_id))
        ) ||
        Number(position_id) <= 0 ||
        !Number.isSafeInteger(Number(position_id))
    ) {
        return res.status(400).json({
            message: "position_id must be a positive integer",
        });
    }

    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            message: "Invalid application status",
            allowed_values: VALID_STATUSES,
        });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({
            message: "priority must be Low, Medium, or High",
        });
    }

    if (
        deadline !== null &&
        (typeof deadline !== "string" || Number.isNaN(Date.parse(deadline)))
    ) {
        return res.status(400).json({
            message: "deadline must be a valid date or null",
        });
    }

    if (notes !== null && typeof notes !== "string") {
        return res.status(400).json({
            message: "notes must be a string or null",
        });
    }

    next();
};

module.exports = {
    validateApplicationBody,
};
