
const validateProfile = (req, res, next) => {
    const {
        full_name,
        university,
        major,
        semester,
        graduation_year,
        headline,
        github_url,
        linkedin_url,
        portfolio_url,
        location
    } = req.body;

    // Field wajib
    if (
        typeof full_name !== "string" ||
        typeof university !== "string" ||
        typeof major !== "string" ||
        semester === undefined ||
        semester === null ||
        semester === ""
    ) {
        const error = new Error(
            "full_name, university, major, and semester are required"
        );
        error.status = 400;
        return next(error);
    }

    // String tidak boleh kosong
    if (
        !full_name.trim() ||
        !university.trim() ||
        !major.trim()
    ) {
        const error = new Error(
            "full_name, university, and major cannot be empty"
        );
        error.status = 400;
        return next(error);
    }

    // Semester harus bilangan bulat 1–20
    if (
        !Number.isInteger(Number(semester)) ||
        Number(semester) < 1 ||
        Number(semester) > 20
    ) {
        const error = new Error(
            "semester must be an integer between 1 and 20"
        );
        error.status = 400;
        return next(error);
    }

    // Tahun kelulusan boleh kosong atau berupa tahun yang valid
    if (
        graduation_year !== undefined &&
        graduation_year !== null &&
        graduation_year !== "" &&
        (
            !Number.isInteger(Number(graduation_year)) ||
            Number(graduation_year) < 2000 ||
            Number(graduation_year) > 2100
        )
    ) {
        const error = new Error("graduation_year must be a valid year");
        error.status = 400;
        return next(error);
    }

    // Field opsional harus berupa string jika dikirim
    const optionalFields = {
        headline,
        github_url,
        linkedin_url,
        portfolio_url,
        location
    };

    for (const [field, value] of Object.entries(optionalFields)) {
        if (value !== undefined && value !== null && typeof value !== "string") {
            const error = new Error(`${field} must be a string`);
            error.status = 400;
            return next(error);
        }
    }

    next();
};

module.exports = validateProfile;
