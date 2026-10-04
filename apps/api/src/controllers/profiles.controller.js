const profiles = [
    {
        id: 1,
        name: "Agus Teri",
        university: "Princeton University",
        major: "Computer Science",
        semester: 5,
        github: "https://github.com/agusteri",
        linkedin: "https://linkedin.com/in/agusteri",
        portfolio: "https://agusteri.dev"
    },
    {
        id: 2,
        name: "Silvi Keju",
        university: "Cakrawala University",
        major: "Information Systems",
        semester: 4,
        github: "https://github.com/silvikeju",
        linkedin: "https://linkedin.com/in/silvikeju",
        portfolio: "https://silvikeju.dev"
    }
];

// GET semua profiles
const getAllProfiles = (req, res) => {
    res.json(profiles);
};

// PUT profile berdasarkan id
const putProfileById = (req, res, next) => {
    const id = parseInt(req.params.id, 10);

    const profile = profiles.find(
        (item) => item.id === id
    );

    if (!profile) {
        const error = new Error("Profile Not Found");
        error.status = 404;

        return next(error);
    }

    const {
        name,
        university,
        major,
        semester,
        github,
        linkedin,
        portfolio
    } = req.body;

    profile.name = name;
    profile.university = university;
    profile.major = major;
    profile.semester = semester;
    profile.github = github;
    profile.linkedin = linkedin;
    profile.portfolio = portfolio;

    res.json(profile);
};

module.exports = {
    getAllProfiles,
    putProfileById
};