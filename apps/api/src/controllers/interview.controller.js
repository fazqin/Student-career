const interview = [
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

// GET semua
const getAllInterviews = (req, res) => {
    res.status(200).json({
        status: "success",
        data: interview
    });
};

// GET spesifik by id
const getInterviewById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const interviewItem = interview.find((item) => item.id === id);

    // buat logic pesan pemberitahuan aja 
    if (interviewItem) {
        res.status(200).json({
            status: "success",
            data: interviewItem
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "Ga ditemukan"
        });
    }
};

module.exports = {
    getAllInterviews,
    getInterviewById
};