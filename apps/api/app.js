const express = require("express");

const PositionRouter = require("./src/routes/positions.routes");
const CompanyRouter = require("./src/routes/company.routes");
const ApplicationRouter = require("./src/routes/application.routes");
const InterviewRouter = require("./src/routes/interview.routes");
const ProfileRouter = require("./src/routes/profiles.routes");
// const validatePosition = require("./middlewares/validatePositions");
//const logger = require("./src/middlewares/logger");


const app = express();
// app.use(logger);
app.use(express.json());
app.use("/api/positions", PositionRouter);
app.use("/api/companies", CompanyRouter);
app.use("/api/applications", ApplicationRouter);
app.use("/api/interview", InterviewRouter);
app.use("/api/profiles", ProfileRouter);

const errorHandler = require("./src/middlewares/error.middleware")

app.use(errorHandler);

module.exports = app;
