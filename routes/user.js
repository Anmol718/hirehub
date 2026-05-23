const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const {
  saveRedirectUrl,
  validateSignup,
  validateLogin,
} = require("./middleware.js"); // added validation middleware

const userController = require("../controllers/users.js");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    req.flash("error", "Too many login attempts. Please try again in 15 minutes.");
    res.redirect("/login");
  },
});

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
  loginLimiter,  // max 5 attempts per 15 min per IP
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
