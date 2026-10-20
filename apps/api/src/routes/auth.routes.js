
const express = require("express");
const router = express.Router();

const { register, login, getMe, logout } = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../middlewares/validation/auth.validate");
const { authenticateToken } = require("../middlewares/auth.middleware");


router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticateToken, getMe);
router.post("/logout", logout);

module.exports = router;
