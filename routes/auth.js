
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { validateLogin, validateSignup } = require("../middleware");

router.get("/signup", authController.renderSignup);
router.post("/signup", validateSignup, authController.signup);

router.get("/login", authController.renderLogin);
router.post("/login", validateLogin, authController.login);

router.get("/logout", authController.logout);

module.exports = router;
