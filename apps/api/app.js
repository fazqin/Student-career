const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./src/middlewares/error.middleware");

const authRoutes = require("./src/routes/auth.routes");
const PositionRouter = require("./src/routes/positions.routes");
const CompanyRouter = require("./src/routes/company.routes");
const ApplicationRouter = require("./src/routes/application.routes");
const InterviewRouter = require("./src/routes/interview.routes");
const DashboardRouter = require("./src/routes/dashboard.routes");
const ProfileRouter = require("./src/routes/profiles.routes");
const AdminBotRouter = require("./src/routes/adminBot.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/positions", PositionRouter);
app.use("/api/companies", CompanyRouter);
app.use("/api/applications", ApplicationRouter);
app.use("/api/interview", InterviewRouter);
app.use("/api/dashboard", DashboardRouter);
app.use("/api/profiles", ProfileRouter);
app.use("/api/admin/bot", AdminBotRouter);

// Error handler harus setelah semua routes
app.use(errorHandler);

module.exports = app;
