const express = require("express");

const JobRouter = require("./src/routes/job.routes");
const CompanyRouter = require("./src/routes/company.routes");
const ApplicationRouter = require("./src/routes/application.routes");

const app = express();

app.use(express.json());

app.use("/api", router);
app.use("/api", JobRouter);
app.use("/api", CompanyRouter);
app.use("/api", ApplicationRouter);

module.exports = app;
