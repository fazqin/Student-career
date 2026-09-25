const profiles = [
    {
        id: 1,
        name: "Agus Teri",
        industry: "Semikonduktor",
        address: "Boston",
        University: "Princeton University"
    },
    {
        id: 2,
        name: "Silvi Keju",
        industry: "BioTech",
        address: "Irlandia",
        University: "Cakrawala University"
    }
];

// GET semua profiles
const getAllProfiles = (req, res) => {
    res.json(profiles);
};

//GET profile berdasarkan id
// const getProfileById = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const profile = profiles.find(
//         (item) => item.id === id
//     );

//     if (profile) {
//         res.json(profile);
//     } else {
//         res.status(404).json({
//             error: "Profile Not Found"
//         });
//     }
// };

module.exports = {
    getAllProfiles
};