const validateInterviewBody = (req, res, next) => {
    const { application_id, company, position, interview_date, type, status } = req.body;

    // Cek apakah ada field wajib yang kosong saat request POST/PUT
    if (!application_id || !company || !position || !interview_date || !type || !status) {
        const error = new Error("Bad Request: All interview fields (application_id, company, position, interview_date, type, status) are required!");
        error.status = 400;
        return next(error);
    }
    next();
};

module.exports = {
    validateInterviewBody
};