
function validateRegister(req, res, next) {
    const {
        email,
        password,
        full_name,
        university,
        major,
        semester,
    } = req.body;

    const errors = [];

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        errors.push("Email tidak valid.");
    }

    if (typeof password !== "string" || password.length < 8) {
        errors.push("Password minimal 8 karakter.");
    }

    if (typeof full_name !== "string" || !full_name.trim()) {
        errors.push("Nama lengkap wajib diisi.");
    }

    if (typeof university !== "string" || !university.trim()) {
        errors.push("Universitas wajib diisi.");
    }

    if (typeof major !== "string" || !major.trim()) {
        errors.push("Jurusan wajib diisi.");
    }

    if (
        semester === undefined ||
        semester === null ||
        semester === "" ||
        !Number.isInteger(Number(semester)) ||
        Number(semester) < 1 ||
        Number(semester) > 20
    ) {
        errors.push("Semester harus berupa angka bulat antara 1 dan 20.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validasi registrasi gagal.",
            errors,
        });
    }

    next();
}


function validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        errors.push("Email tidak valid.");
    }

    if (typeof password !== "string" || password.length === 0) {
        errors.push("Password wajib diisi.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validasi login gagal.",
            errors,
        });
    }

    return next();
}


module.exports = {
    validateRegister,
    validateLogin,
};
