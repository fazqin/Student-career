const applications = [
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
        status: "Interview", 
        deadline: "2026-04-05" 
    },
    {
        id: 3,
        company: "Creative Agency",
        position: "UI/UX Designer",
        status: "Rejected",
        deadline: "2026-04-10"
    }
];

// GET semua
const getAllApplications = (req, res) => {
    res.json(applications);
};

// GET spesifik by id
const getApplicationById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const appItem = applications.find((item) => item.id === id);

    if (appItem) {
        res.json(appItem);
    } else {
        res.status(404).json({
            error: "Application Not Found"
        });
    }
};

// POST tambah lamaran baru
const createApplication = (req, res) => {
    const { company, position, status, deadline } = req.body;

    const newApplication = {
        id: applications.length + 1,
        company,
        position,
        status,
        deadline
    };

    applications.push(newApplication);
    res.status(201).json(newApplication);
};

// PUT update seluruh data
const updateApplication = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = applications.findIndex((item) => item.id === id);
    const application = applications[index];

    const { company, position, status, deadline } = req.body;

    if (application) {
        application.company = company;
        application.position = position;
        application.status = status;
        application.deadline = deadline;

        res.json(application);
    } else {
        res.status(404).json({
            error: "Application Not Found"
        });
    }
};

// PATCH update sebagian -> status
const patchApplication = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const appItem = applications.find((item) => item.id === id);
    
    const { company, position, status, deadline } = req.body;

    if (appItem) {
        if (company) appItem.company = company;
        if (position) appItem.position = position;
        if (status) appItem.status = status;
        if (deadline) appItem.deadline = deadline;

        res.json(appItem);
    } else {
        res.status(404).json({
            error: "Application Not Found"
        });
    }
};

// DELETE hapus lamaran
const deleteApplication = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = applications.findIndex((item) => item.id === id);

    if (index !== -1) {
        applications.splice(index, 1);

        res.status(200).json({
            message: "Application deleted successfully"
        });
    } else {
        res.status(404).json({
            error: "Application Not Found"
        });
    }
};

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    patchApplication,
    deleteApplication
};