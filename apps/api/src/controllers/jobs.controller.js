const jobs = [
    {
        id: 1,
        name: "ML Engineer",
        industry: "Telecommunication",
        location: "Bandung",
        InternStatus: "Paid"
    },
    {
        id: 2,
        name: "Data Scientist",
        industry: "Technology",
        location: "Jakarta",
        InternStatus: "Unpaid"
    }
];

// GET semua jobs
const getAllJobs = (req, res) => {
    res.json(jobs);
};

// GET job berdasarkan id
const getJobById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const job = jobs.find(
        (item) => item.id === id
    );

    if (job) {
        res.json(job);
    } else {
        res.status(404).json({
            error: "Job Not Found"
        });
    }
};

// POST Job
const postAllJob = (req, res) => {
    const {name, industry, location, InternStatus} = req.body;

    const newJob = {
        id: jobs.length + 1,
        name,
        industry,
        location,
        InternStatus
    }
    jobs.push(newJob);
    res.status(201).json(newJob);

}

// PUT Job by id
const putJobById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const job = jobs.find(
        (item) => item.id === id
    )
    const {name, industry, location, InternStatus} = req.body;

    if (job) {
        job.name = name;
        job.industry = industry;
        job.location = location;
        job.InternStatus = InternStatus;
        res.json(job);
    } else {
        res.status(404).json({
            error: "Job Not Found"
        });
    }
}

// PATCH Job by id
const patchJobById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const job = jobs.find(
        (item) => item.id === id
    )
    const {name, industry, location, InternStatus} = req.body;

    if (job) {
        if (name) job.name = name;
        if (industry) job.industry = industry;
        if (location) job.location = location;
        if (InternStatus) job.InternStatus = InternStatus;
        res.json(job);
    } else {
        res.status(404).json({
            error: "Job Not Found"
        });
    }
}

// DELETE Job by id
const delJobById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const jobIndex = jobs.findIndex(
        (item) => item.id === id
    );

    if (jobIndex !== -1) {
        jobs.splice(jobIndex, 1);
        res.status(200).json({
            message: "Job deleted successfully"
        });
    } else {
        res.status(404).json({
            error: "Job Not Found"
        });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    postAllJob,
    putJobById,
    patchJobById,
    delJobById
};