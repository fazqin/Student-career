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
    res.status(200).json({
        status: "success",
        data: applications
    });
};

// GET spesifik by id
const getApplicationById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const appItem = applications.find((item) => item.id === id);

    if (appItem) {
        res.status(200).json({
            status: "success",
            data: appItem
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "daftar lamaran tidak ditemukan"
        });
    }
};

// POST tambah lamaran baru
const createApplication = (req, res) => {
    const { company, position, status, deadline } = req.body;

    const newApp = {
        id: applications.length > 0 ? applications[applications.length - 1].id + 1 : 1,
        company: company || "",
        position: position || "",
        status: status || "Applied",
        deadline: deadline || ""
    };

    applications.push(newApp);

    res.status(201).json({
        status: "success",
        message: "Lamaran berhasil ditambahkan",
        data: newApp
    });
};

// PUT update seluruh data
const updateApplication = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = applications.findIndex((item) => item.id === id);

    if (index !== -1) {
        const { company, position, status, deadline } = req.body;

        applications[index] = {
            ...applications[index],
            company: company ?? applications[index].company,
            position: position ?? applications[index].position,
            status: status ?? applications[index].status,
            deadline: deadline ?? applications[index].deadline
        };

        res.status(200).json({
            status: "success",
            message: `Data lamaran ID ${id} berhasil diperbarui (PUT)`,
            data: applications[index]
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "daftar lamaran tidak ditemukan"
        });
    }
};

// PATCH update sebagian -> status
const patchApplication = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const appItem = applications.find((item) => item.id === id);

    if (appItem) {
        Object.assign(appItem, req.body);

        res.status(200).json({
            status: "success",
            message: `Status/data lamaran ID ${id} berhasil diperbarui (PATCH)`,
            data: appItem
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "daftar lamaran tidak ditemukan"
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
            status: "success",
            message: `Lamaran ID ${id} berhasil dihapus`
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "daftar lamaran tidak ditemukan"
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