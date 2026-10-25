const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const interviews = [
    {
        id: 1,
        application_id: 1,
        company: "PT OTW KAYA",
        position: "QA",
        interview_date: "2026-04-01T10:00:00Z",
        type: "Online (Google Meet)",
        status: "Scheduled"
    },
    {
        id: 2,
        application_id: 2,
        company: "Tech Corp",
        position: "Backend Developer",
        interview_date: "2026-04-06T14:00:00Z",
        type: "Offline (User Interview)",
        status: "Completed"
    }
];

// Helper to optionally resolve user from cookie
function resolveUser(req) {
    const token = req.cookies?.access_token;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}

// GET semua interview (menggabungkan lamaran berstatus 'Interview' dari database)
const getAllInterviews = async (req, res, next) => {
    try {
        const user = req.user || resolveUser(req);
        let dbInterviews = [];

        try {
            let query = `
                SELECT
                    a.id,
                    a.user_id,
                    a.status,
                    a.deadline AS application_deadline,
                    a.notes,
                    a.created_at,
                    a.updated_at,
                    p.title AS position_title,
                    p.deadline AS position_deadline,
                    c.name AS company_name,
                    c.industry AS company_industry
                FROM applications a
                JOIN positions p ON p.id = a.position_id
                JOIN companies c ON c.id = p.company_id
                WHERE a.status = 'Interview'
            `;
            const params = [];
            if (user && user.role !== "admin") {
                query += ` AND a.user_id = $1`;
                params.push(user.id);
            }
            query += ` ORDER BY a.updated_at DESC`;

            const result = await pool.query(query, params);
            dbInterviews = result.rows.map((row) => {
                const sessionDate = row.application_deadline || row.position_deadline || row.updated_at || new Date().toISOString();
                return {
                    id: `app_${row.id}`,
                    application_id: row.id,
                    company: row.company_name,
                    position: row.position_title,
                    interview_date: sessionDate,
                    date: sessionDate,
                    type: "Online (Google Meet)",
                    title: `${row.position_title} Interview`,
                    contact: row.company_name,
                    location: "Online (Google Meet)",
                    status: "Scheduled"
                };
            });
        } catch (dbErr) {
            console.warn("Notice: Database query for interview applications failed:", dbErr.message);
        }

        if (dbInterviews.length > 0) {
            return res.json(dbInterviews);
        }

        // Jika tidak ada data di DB dan user belum login, tampilkan fallback contoh
        if (!user) {
            const formattedManual = interviews.map((item) => ({
                ...item,
                date: item.interview_date || item.date || new Date().toISOString(),
                title: item.title || `${item.position || "Position"} Interview`,
                contact: item.contact || item.company || "Recruiter",
                location: item.location || item.type || "Online (Google Meet)"
            }));
            return res.json(formattedManual);
        }

        return res.json([]);
    } catch (error) {
        next(error);
    }
};

// GET spesifik by id
const getInterviewById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (String(id).startsWith("app_") || !isNaN(Number(id))) {
            const appId = String(id).replace("app_", "");
            try {
                const query = `
                    SELECT
                        a.id,
                        a.user_id,
                        a.status,
                        a.deadline AS application_deadline,
                        a.notes,
                        a.created_at,
                        a.updated_at,
                        p.title AS position_title,
                        p.deadline AS position_deadline,
                        c.name AS company_name,
                        c.industry AS company_industry
                    FROM applications a
                    JOIN positions p ON p.id = a.position_id
                    JOIN companies c ON c.id = p.company_id
                    WHERE a.id = $1 AND a.status = 'Interview'
                `;
                const result = await pool.query(query, [appId]);
                if (result.rows.length > 0) {
                    const row = result.rows[0];
                    const sessionDate = row.application_deadline || row.position_deadline || row.updated_at || new Date().toISOString();
                    return res.json({
                        id: `app_${row.id}`,
                        application_id: row.id,
                        company: row.company_name,
                        position: row.position_title,
                        interview_date: sessionDate,
                        date: sessionDate,
                        type: "Online (Google Meet)",
                        title: `${row.position_title} Interview`,
                        contact: row.company_name,
                        location: "Online (Google Meet)",
                        status: "Scheduled"
                    });
                }
            } catch {
                // proceed
            }
        }

        const numericId = parseInt(id, 10);
        const interviewItem = interviews.find((item) => item.id === numericId);

        if (interviewItem) {
            return res.json({
                ...interviewItem,
                date: interviewItem.interview_date || interviewItem.date,
                title: interviewItem.title || `${interviewItem.position} Interview`,
                contact: interviewItem.contact || interviewItem.company,
                location: interviewItem.location || interviewItem.type
            });
        }

        return res.status(404).json({
            error: "Interview Not Found"
        });
    } catch (error) {
        next(error);
    }
};

// POST tambah interview baru
const createInterview = (req, res) => {
    const { application_id, company, position, interview_date, type, status } = req.body;

    const newInterview = {
        id: interviews.length + 1,
        application_id,
        company,
        position,
        interview_date,
        date: interview_date,
        type,
        location: type || "Online (Google Meet)",
        title: `${position} Interview`,
        contact: company,
        status
    };

    interviews.push(newInterview);
    res.status(201).json(newInterview);
};

// PUT update seluruh data
const updateInterview = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = interviews.findIndex((item) => item.id === id);
    const interviewItem = interviews[index];

    const { application_id, company, position, interview_date, type, status } = req.body;

    if (interviewItem) {
        interviewItem.application_id = application_id;
        interviewItem.company = company;
        interviewItem.position = position;
        interviewItem.interview_date = interview_date;
        interviewItem.date = interview_date;
        interviewItem.type = type;
        interviewItem.location = type;
        interviewItem.title = `${position} Interview`;
        interviewItem.contact = company;
        interviewItem.status = status;

        res.json(interviewItem);
    } else {
        res.status(404).json({
            error: "Interview Not Found"
        });
    }
};

// DELETE hapus interview
const deleteInterview = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = interviews.findIndex((item) => item.id === id);

    if (index !== -1) {
        interviews.splice(index, 1);

        res.status(200).json({
            message: "Interview deleted successfully"
        });
    } else {
        res.status(404).json({
            error: "Interview Not Found"
        });
    }
};

module.exports = {
    getAllInterviews,
    getInterviewById,
    createInterview,
    updateInterview,
    deleteInterview
};
