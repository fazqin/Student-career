const express = require("express");

const PositionRouter = require("./src/routes/positions.routes");
const CompanyRouter = require("./src/routes/company.routes");
const ApplicationRouter = require("./src/routes/application.routes");
const InterviewRouter = require("./src/routes/interview.routes");
const ProfileRouter = require("./src/routes/profiles.routes");

const app = express();

app.use(express.json());
app.use("/api/positions", PositionRouter);
app.use("/api/companies", CompanyRouter);
app.use("/api/applications", ApplicationRouter);
app.use("/api/interview", InterviewRouter);
app.use("/api/profiles", ProfileRouter);

module.exports = app;
