const Job = require("../models/jobs");
const ExpressError = require("../utils/ExpressError.js");
const {
  jobSchema,
  applicationSchema,
  signupSchema,
  loginSchema,
} = require("../schema.js");

// =========================
// Authentication & Authorization Middleware
// =========================

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save original URL to redirect after login
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL in res.locals for use in templates
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Only allow employers to access certain routes
module.exports.isEmployer = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    return next();
  }
  req.flash("error", "You must be an employer to access this page.");
  return res.redirect("/home");
};

// Only allow admins to access certain routes
module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  req.flash("error", "You must be an admin to access this page.");
  return res.redirect("/home");
};

// Check if the logged-in user is the owner of a job post
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    req.flash("error", "Job not found.");
    return res.redirect("/jobs");
  }
  if (!job.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this post!");
    return res.redirect(`/jobs/${id}`);
  }
  next();
};

// =========================
// Validation Middleware
// =========================

// Validate job data using Joi schema
module.exports.validateJob = (req, res, next) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Validate application data using Joi schema
module.exports.validateApplication = (req, res, next) => {
  // Joi validation for form fields
  const { error } = applicationSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }

  // Phone number validation (optional '+' and 10-15 digits)
  if (req.body.phone) {
    const phonePattern = /^\+?[0-9]{10,15}$/;
    if (!phonePattern.test(req.body.phone)) {
      throw new ExpressError(
        400,
        "Phone number must be 10–15 digits, optional '+' at the start.",
      );
    }
  }

  // Resume file validation
  const resumeFile = req.files && req.files["resume"] && req.files["resume"][0];
  if (!resumeFile) {
    throw new ExpressError(400, "Resume file is required!");
  }
  if (resumeFile.mimetype !== "application/pdf") {
    throw new ExpressError(400, "Resume must be a PDF file!");
  }

  // Cover letter PDF validation (optional)
  const clFile = req.files && req.files["coverLetterFile"] && req.files["coverLetterFile"][0];
  if (clFile && clFile.mimetype !== "application/pdf") {
    throw new ExpressError(400, "Cover letter must be a PDF file!");
  }

  next();
};

module.exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else next();
};

module.exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else next();
};
