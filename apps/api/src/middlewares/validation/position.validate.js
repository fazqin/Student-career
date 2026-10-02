const validatePosition = (req, res, next) => {
    const {name, industry, location, InternStatus} = req.body;

// kalau misal user gak boleh sama sekali ada angka bisa pake !isNaN

    if (!name || !industry || !location || !InternStatus) {
        return res.status(400).json({
            error: "name, industry, location, InterStatus are required"
        });
    }

    if (typeof name !== "string" || !name.trim() ||
        typeof industry !== "string" || !industry.trim() ||
        typeof location !== "string"  || !location.trim()
        ) {
        return res.status(400).json({
            error: "name, industry, location must be string"
        });
    }

    if(
        name.trim() === "" ||
        industry.trim() === "" ||
        location.trim() === ""
    ) {
        return res.status(400).json({
            error: "name, industry, location cannot be empty"
        });
    }

    if(name.trim().length < 3 || name.trim().length > 50) {
        return res.status(400).json({
            error: "name must be between 3 and 50 characters"
        })
    }

    if (InternStatus !== "Paid" && InternStatus !== "Unpaid") {
    return res.status(400).json({
        error: "InternStatus must be Paid or Unpaid"
    });
}
    next();
};

module.exports = validatePosition;