const express  = require("express");
const router   = express.Router();
const rateLimit = require("express-rate-limit");
const wrapAsync = require("../utils/wrapAsync");
const User      = require("../models/user.js");
const passport  = require("passport");
const {
  saveRedirectUrl,
  validateSignup,
  validateLogin,
} = require("./middleware.js");

const userController = require("../controllers/users.js");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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

router.get("/signup", userController.renderSignupForm);

router.post(
  "/signup",
  wrapAsync(userController.checkRecaptcha), // verify reCAPTCHA before registering
  validateSignup,
  wrapAsync(userController.signup),
);

// =======================
// Login Routes
// =======================

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  loginLimiter,
  wrapAsync(userController.checkRecaptcha), // verify reCAPTCHA before authenticating
  saveRedirectUrl,
  validateLogin,
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
