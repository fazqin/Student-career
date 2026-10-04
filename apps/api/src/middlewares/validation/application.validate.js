const validateApplicationBody = (req, res, next) => {
    const { company, position, status, deadline } = req.body;

    // Cek apakah field wajib di-body kosong saat melakukan POST/PUT
    if (!company || !position || !status || !deadline) {
        const error = new Error("Bad Request: Company, position, status, and deadline are required!");
        error.status = 400; 
        return next(error); 
    }

    next();
};

module.exports = {
    validateApplicationBody
};