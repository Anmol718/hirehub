const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const {
  saveRedirectUrl,
  validateSignup,
  validateLogin,
} = require("./middleware.js"); // added validation middleware

const userController = require("../controllers/users.js");

// =======================
// Signup Routes
// =======================

// Render signup form
router.get("/signup", userController.renderSignupForm);

// Handle signup form submission with Joi validation
router.post(
  "/signup",
  validateSignup, // validate input before signup
  wrapAsync(userController.signup),
);

// =======================
// Login Routes
// =======================

// Render login form
router.get("/login", userController.renderLoginForm);

// Handle login with validation and Passport authentication
router.post(
  "/login",
  saveRedirectUrl, // optional: saves redirect URL after login
  validateLogin, // validate input before login
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login,
);

// =======================
// Logout Route
// =======================
router.get("/logout", userController.logout);

module.exports = router;
