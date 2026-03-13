const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const applicationController = require("../controllers/applications.js");
const {
  isLoggedIn,
  isEmployer,
  validateApplication,
} = require("./middleware.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const Application = require("../models/application.js");
const { sendApplicationStatusEmail } = require("../utils/mailer.js");

const upload = multer({ storage });

// =======================
// Candidate routes
// =======================

// My Applications Dashboard
router.get(
  "/my-applications",
  isLoggedIn,
  wrapAsync(applicationController.myApplications),
);

// Render job application form
router.get(
  "/:id/apply",
  isLoggedIn,
  wrapAsync(applicationController.renderApplyForm),
);

// Submit job application
router.post(
  "/:id/apply",
  isLoggedIn,
  upload.fields([{ name: "resume", maxCount: 1 }, { name: "coverLetterFile", maxCount: 1 }]),
  validateApplication,
  wrapAsync(applicationController.applyJob),
);

// Withdraw application (candidate only)
router.delete(
  "/:id/withdraw",
  isLoggedIn,
  wrapAsync(applicationController.withdrawApplication),
);

// Remove application (employer only)
router.delete(
  "/:id/remove",
  isLoggedIn,
  isEmployer,
  wrapAsync(applicationController.removeApplication),
);

// Serve resume PDFs via signed Cloudinary URL
router.get(
  "/resume/:id",
  isLoggedIn,
  isEmployer,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!id || id === "undefined") {
      req.flash("error", "Invalid resume request");
      return res.redirect("back");
    }

    const app = await Application.findById(id);
    if (!app || !app.resume || !app.resume.filename) {
      req.flash("error", "Resume not found");
      return res.redirect("back");
    }

    try {
      const signedUrl = cloudinary.url(app.resume.filename, {
        resource_type: "raw",
        type: "upload",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 120,
      });
      return res.redirect(signedUrl);
    } catch (err) {
      console.error("Error generating signed URL:", err);
      req.flash("error", "Cannot open resume at this time");
      return res.redirect("back");
    }
  }),
);

// =======================
// Employer routes
// =======================

// View applicants for a job
router.get(
  "/:jobId/applicants",
  isLoggedIn,
  isEmployer,
  wrapAsync(applicationController.viewApplicants),
);

// Accept an application
router.post(
  "/:id/accept",
  isLoggedIn,
  isEmployer,
  wrapAsync(async (req, res) => {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" },
      { new: true },
    ).populate("job");
    sendApplicationStatusEmail(application, application.job)
      .then(() => console.log("Email sent successfully to:", application.email))
      .catch((err) => console.error("Email sending failed:", err));
    req.flash("success", "Application accepted and candidate notified via email");
    res.redirect(req.get("Referrer") || "/jobs");
  }),
);

// Reject an application
router.post(
  "/:id/reject",
  isLoggedIn,
  isEmployer,
  wrapAsync(async (req, res) => {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true },
    ).populate("job");
    sendApplicationStatusEmail(application, application.job).catch((err) =>
      console.error("Email sending failed:", err.message)
    );
    req.flash("success", "Application rejected and candidate notified via email");
    res.redirect(req.get("Referrer") || "/jobs");
  }),
);

module.exports = router;
