const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const jobController = require("../controllers/jobs.js");
const { isLoggedIn, isOwner, validateJob } = require("./middleware.js");

// Job CRUD
router.get("/", wrapAsync(jobController.index));
router.get("/new", isLoggedIn, wrapAsync(jobController.renderNewForm));
router.post("/", isLoggedIn, validateJob, wrapAsync(jobController.createJob));
router.get("/:id", wrapAsync(jobController.showJob));
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(jobController.renderEditForm),
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateJob,
  wrapAsync(jobController.updateJob),
);
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(jobController.destroyJob));

module.exports = router;
