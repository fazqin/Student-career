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
const getCompanyById = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const company = companies.find((item) => item.id === id);

    if (!company) {
        const error = new Error("Company Not Found");
        error.status = 404;
        return next(error);
    }

    res.json(company);
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
const putCompanyById = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const company = companies.find((item) => item.id === id);

    if (!company) {
        const error = new Error("Company Not Found");
        error.status = 404;
        return next(error);
    }

    const { name, industry, location, website } = req.body;

    company.name = name;
    company.industry = industry;
    company.location = location;
    company.website = website;

    res.json(company);
};

// DELETE Company berdasarkan id
const delCompanyById = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const companyIndex = companies.findIndex((item) => item.id === id);

    if (companyIndex === -1) {
        const error = new Error("Company Not Found");
        error.status = 404;
        return next(error);
    }

    companies.splice(companyIndex, 1);
    res.status(200).json({
        message: "Company deleted successfully"
    });
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    postAllCompany,
    putCompanyById,
    delCompanyById
};