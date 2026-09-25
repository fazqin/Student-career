const interview = [
    { 
        id: 1, 
        company: "PT OTW KAYA", 
        position: "QA", 
        status: "Applied", 
        deadline: "2026-03-30" 
    },
    { 
        id: 2, 
        company: "Tech Corp", 
        position: "Backend Developer", 
        status: "On Going", 
        deadline: "2026-04-05" 
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