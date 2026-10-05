const validateCompany = (req, res, next) => {
    const { name, industry, location, website } = req.body;

    if (!name || !industry || !location || !website) {
        const error = new Error(
            "name, industry, location, website are required"
        );
        error.status = 400;
        return next(error);
    }

    if (
        typeof name !== "string" ||
        typeof industry !== "string" ||
        typeof location !== "string" ||
        typeof website !== "string"
    ) {
        const error = new Error(
            "name, industry, location, website must be string"
        );
        error.status = 400;
        return next(error);
    }

    if (
        !name.trim() ||
        !industry.trim() ||
        !location.trim() ||
        !website.trim()
    ) {
        const error = new Error(
            "name, industry, location, website cannot be empty"
        );
        error.status = 400;
        return next(error);
    }

    if (name.trim().length < 3 || name.trim().length > 100) {
        const error = new Error(
            "name must be between 3 and 100 characters"
        );
        error.status = 400;
        return next(error);
    }

    next();
};

module.exports = validateCompany;