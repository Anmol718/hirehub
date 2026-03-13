const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const adminController = require("../controllers/admin.js");
const { isLoggedIn, isAdmin } = require("./middleware.js");

// Admin dashboard
router.get(
  "/dashboard",
  isLoggedIn,
  isAdmin,
  wrapAsync(adminController.dashboard),
);

// Manage all jobs
router.get("/jobs", isLoggedIn, isAdmin, wrapAsync(adminController.manageJobs));
router.delete(
  "/jobs/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(adminController.deleteJob),
);

// Manage all users
router.get(
  "/users",
  isLoggedIn,
  isAdmin,
  wrapAsync(adminController.manageUsers),
);
router.delete(
  "/users/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(adminController.deleteUser),
);

// Manage applications
router.get(
  "/applications",
  isLoggedIn,
  isAdmin,
  wrapAsync(adminController.manageApplications),
);
router.delete(
  "/applications/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(adminController.deleteApplication),
);

module.exports = router;
