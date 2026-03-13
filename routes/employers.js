const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const employersController = require("../controllers/employers.js");
const { isLoggedIn, isEmployer } = require("../routes/middleware.js");

// Dashboard / Home (employer only)
router.get(
  "/dashboard",
  isLoggedIn,
  isEmployer,
  wrapAsync(employersController.dashboard),
);

// Manage Jobs page (show only jobs created by this employer)
router.get(
  "/jobs",
  isLoggedIn,
  isEmployer,
  wrapAsync(employersController.showJobs),
);

module.exports = router;
