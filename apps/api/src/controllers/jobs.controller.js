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

module.exports = {
    getAllJobs,
    getJobById
};