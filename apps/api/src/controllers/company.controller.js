const companies = [
    {
        id: 1,
        name: "Telkom Indonesia",
        industry: "Telecommunication",
        location: "Bandung",
        website: "https://telkom.co.id"
    },
    {
        id: 2,
        name: "Tokopedia",
        industry: "Technology",
        location: "Jakarta",
        website: "https://tokopedia.com"
    }
];

// GET semua company
const getAllCompanies = (req, res) => {
    res.json(companies);
};

// GET company berdasarkan id
const getCompanyById = (req, res) => {
    const id = parseInt(req.params.id, 10);

    const company = companies.find(
        (item) => item.id === id
    );

    if (company) {
        res.json(company);
    } else {
        res.status(404).json({
            error: "Company Not Found"
        });
    }
};

// POST Company
const postAllCompany = (req, res) => {
    const { name, industry, location, website } = req.body;

    const newCompany = {
        id: companies.length + 1,
        name,
        industry,
        location,
        website
    };

    companies.push(newCompany);

    res.status(201).json(newCompany);
};

// PUT Company berdasarkan id
const putCompanyById = (req, res) => {
    const id = parseInt(req.params.id, 10);

    const company = companies.find(
        (item) => item.id === id
    );

    const { name, industry, location, website } = req.body;

    if (company) {
        company.name = name;
        company.industry = industry;
        company.location = location;
        company.website = website;

        res.json(company);
    } else {
        res.status(404).json({
            error: "Company Not Found"
        });
    }
};

// DELETE Company berdasarkan id
const delCompanyById = (req, res) => {
    const id = parseInt(req.params.id, 10);

    const companyIndex = companies.findIndex(
        (item) => item.id === id
    );

    if (companyIndex !== -1) {
        companies.splice(companyIndex, 1);

        res.status(200).json({
            message: "Company deleted successfully"
        });
    } else {
        res.status(404).json({
            error: "Company Not Found"
        });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    postAllCompany,
    putCompanyById,
    delCompanyById
};