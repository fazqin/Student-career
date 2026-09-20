const express = require("express");

const companyRoutes = require("./src/routes/company.routes");

const app = express();

app.use(express.json());

app.use("/api", companyRoutes);

module.exports = app;