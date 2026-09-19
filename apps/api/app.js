const express = require("express");

const router = require("./src/routes/name.routes");
const JobRouter = require("./src/routes/job.routes");

const app = express();

app.use(express.json());

app.use("/api", router);
app.use("/api", JobRouter);

module.exports = app;