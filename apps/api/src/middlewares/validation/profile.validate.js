const validateProfile = (req, res, next) => {
    const {
        name,
        university,
        major,
        semester,
        github,
        linkedin,
        portfolio
    } = req.body;

    if (!name || !university || !major || !semester) {
        const error = new Error(
            "name, university, major, semester are required"
        );

        error.status = 400;

        return next(error);
    }

    if (
        typeof name !== "string" ||
        typeof university !== "string" ||
        typeof major !== "string"
    ) {
        const error = new Error(
            "name, university, major must be string"
        );

        error.status = 400;

        return next(error);
    }

    if (
        !name.trim() ||
        !university.trim() ||
        !major.trim()
    ) {
        const error = new Error(
            "name, university, major cannot be empty"
        );

        error.status = 400;

        return next(error);
    }

    if (
        !Number.isInteger(Number(semester)) ||
        Number(semester) < 1
    ) {
        const error = new Error(
            "semester must be a positive number"
        );

        error.status = 400;

        return next(error);
    }

    next();
};

module.exports = validateProfile;