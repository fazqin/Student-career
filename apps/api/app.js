
const express = require("express");
const cors = require("cors");

const PositionRouter = require("./src/routes/positions.routes");
const CompanyRouter = require("./src/routes/company.routes");
const ApplicationRouter = require("./src/routes/application.routes");
const InterviewRouter = require("./src/routes/interview.routes");
const ProfileRouter = require("./src/routes/profiles.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// API routes
app.use("/api/positions", PositionRouter);
app.use("/api/companies", CompanyRouter);
app.use("/api/applications", ApplicationRouter);
app.use("/api/interview", InterviewRouter);
app.use("/api/profiles", ProfileRouter);

// Error handler harus setelah semua routes
const errorHandler = require("./src/middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
