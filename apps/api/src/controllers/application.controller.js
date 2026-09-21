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
    }
];

// GET semua
const getAllApplications = (req, res) => {
    res.status(200).json({
        status: "success",
        data: applications
    });
};

// GET spesifik by id
const getApplicationById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const appItem = applications.find((item) => item.id === id);

    // buat logic pesan pemberitahuan aja 
    if (appItem) {
        res.status(200).json({
            status: "success",
            data: appItem
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "Ga ditemukan"
        });
    }
};

module.exports = {
    getAllApplications,
    getApplicationById
};