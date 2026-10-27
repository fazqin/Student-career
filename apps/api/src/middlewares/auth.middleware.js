
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // Ambil token dari cookie
    let token = req.cookies?.access_token;

    // Jika tidak ada di cookie, ambil dari Header Authorization Bearer
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Autentikasi diperlukan. Silakan login.",
        });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        return next();
    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            return res.status(401).json({
                success: false,
                message: "Token tidak valid atau sudah kedaluwarsa. Silakan login kembali.",
            });
        }

        return next(error);
    }
}

module.exports = {
    authenticateToken,
};
