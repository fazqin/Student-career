const companies = [
    {
        id: 1,
        name: "Telkom Indonesia",
        description:"Electricity company",
        website: "https://telkom.co.id"
    },
    {
        id: 2,
        name: "Tokopedia",
        description: "E-commerce company",
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
    const { name, description, website } = req.body;
    const newCompany = {
        id: companies.length + 1,
        name,
        description,
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

    const { name, description, website } = req.body;

    company.name = name;
    company.description = description;
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