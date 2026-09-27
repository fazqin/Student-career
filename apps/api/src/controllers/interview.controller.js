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

// GET semua
const getAllInterviews = (req, res) => {
    res.json(interviews);
};

// GET spesifik by id
const getInterviewById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const interviewItem = interviews.find((item) => item.id === id);

    if (interviewItem) {
        res.json(interviewItem);
    } else {
        res.status(404).json({
            error: "Interview Not Found"
        });
    }
};

//POST tambah interview baru
const createInterview = (req, res) => {
    const { application_id, company, position, interview_date, type, status } = req.body;

    const newInterview = {
        id: interviews.length + 1,
        application_id,
        company,
        position,
        interview_date,
        type,
        status
    };

    interviews.push(newInterview);
    res.status(201).json(newInterview);
};

//PUT update seluruh data
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
        interviewItem.type = type;
        interviewItem.status = status;

        res.json(interviewItem);
    } else {
        res.status(404).json({
            error: "Interview Not Found"
        });
    }
};

//PATCH update sebagian data
const patchInterview = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const interviewItem = interviews.find((item) => item.id === id);

    const { application_id, company, position, interview_date, type, status } = req.body;

    if (interviewItem) {
        if (application_id) interviewItem.application_id = application_id;
        if (company) interviewItem.company = company;
        if (position) interviewItem.position = position;
        if (interview_date) interviewItem.interview_date = interview_date;
        if (type) interviewItem.type = type;
        if (status) interviewItem.status = status;

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
    patchInterview,
    deleteInterview
};