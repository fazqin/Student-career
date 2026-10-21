
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

// Validasi field yang dikirim
const validateFields = (body, fields) => {
    const errors = [];

    for (const field of fields) {
        if (!Object.prototype.hasOwnProperty.call(body, field)) {
            continue;
        }

        const value = body[field];

        if (field === "position_id") {
            const valid =
                (typeof value === "number" && Number.isSafeInteger(value)) ||
                (typeof value === "string" && /^\d+$/.test(value));

            if (!valid || Number(value) <= 0 ||
                !Number.isSafeInteger(Number(value))) {
                errors.push("position_id must be a positive integer");
            }
        }

        if (field === "status" &&
            (typeof value !== "string" || !VALID_STATUSES.includes(value))) {
            errors.push("Invalid application status");
        }

        if (field === "priority" &&
            (typeof value !== "string" || !VALID_PRIORITIES.includes(value))) {
            errors.push("priority must be Low, Medium, or High");
        }

        if (field === "deadline" && value !== null) {
            const normalizedDate = typeof value === "string" ? value.slice(0, 10) : "";
            const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(normalizedDate);


            let isValidDate = false;

            if (isValidFormat) {
                const [year, month, day] = normalizedDate.split("-").map(Number);
                const date = new Date(Date.UTC(year, month - 1, day));

                isValidDate =
                    date.getUTCFullYear() === year &&
                    date.getUTCMonth() === month - 1 &&
                    date.getUTCDate() === day;

                if (isValidDate) {
                    body[field] = normalizedDate; 
                }
            }

            if (!isValidDate) {
                errors.push("deadline must be a valid date in YYYY-MM-DD format or null");
            }
        }

                if (field === "notes" && value !== null &&
                    typeof value !== "string") {
                    errors.push("notes must be a string or null");
                }
            }

            return errors;
        };

// POST: membuat lamaran
const validateCreateApplication = (req, res, next) => {
    const { position_id } = req.body;

    if (position_id === undefined || position_id === null) {
        return res.status(400).json({
            success: false,
            message: "position_id is required",
        });
    }

    const errors = validateFields(req.body, [
        "position_id",
        "status",
        "priority",
        "deadline",
        "notes",
    ]);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid application data",
            errors,
        });
    }

    return next();
};

// PUT: mengganti data lamaran
const validateUpdateApplication = (req, res, next) => {
    const requiredFields = ["position_id", "status", "priority"];
    const missingFields = requiredFields.filter(
        (field) => req.body[field] === undefined
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing",
            errors: missingFields.map((field) => `${field} is required`),
        });
    }

    const errors = validateFields(req.body, [
        "position_id",
        "status",
        "priority",
        "deadline",
        "notes",
    ]);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid application data",
            errors,
        });
    }

    return next();
};

// PATCH: memperbarui sebagian data lamaran
const validatePatchApplication = (req, res, next) => {
    const allowedFields = [
        "position_id",
        "status",
        "priority",
        "deadline",
        "notes",
    ];

    const suppliedFields = Object.keys(req.body);
    const invalidFields = suppliedFields.filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Unknown or disallowed fields",
            errors: invalidFields,
        });
    }

    if (suppliedFields.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one field must be provided",
        });
    }

    const errors = validateFields(req.body, allowedFields);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid application data",
            errors,
        });
    }

    return next();
};

module.exports = {
    validateCreateApplication,
    validateUpdateApplication,
    validatePatchApplication,
};
