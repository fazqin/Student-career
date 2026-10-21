const validatePosition = (req, res, next) => {
    const { title, name, company_id, companyId, location } = req.body;
    const targetTitle = title || name;
    const targetCompanyId = company_id || companyId;

    if (!targetTitle || !targetCompanyId || !location) {
        return res.status(400).json({
            error: "Title, company_id, and location are required"
        });
    }

    if (typeof targetTitle !== "string" || targetTitle.trim().length < 3) {
        return res.status(400).json({
            error: "Title must be a string with at least 3 characters"
        });
    }

    next();
};

module.exports = validatePosition;
