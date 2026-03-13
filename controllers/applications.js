const Job = require("../models/jobs.js");
const Application = require("../models/application.js");

// =======================
// Candidate routes
// =======================

// Render job application form
module.exports.renderApplyForm = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    req.flash("error", "Job not found!");
    return res.redirect("/jobs");
  }
  res.render("sections/apply.ejs", { job, user: req.user });
};

// Handle job application submission
module.exports.applyJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;

  // Prevent duplicate applications
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (existingApplication) {
    req.flash("error", "You have already applied for this job!");
    return res.redirect(`/jobs/${jobId}`);
  }

  // Check if resume file uploaded
  const resumeFile = req.files && req.files["resume"] && req.files["resume"][0];
  if (!resumeFile) {
    req.flash("error", "Resume file is required!");
    return res.redirect("back");
  }

  const coverLetterFile = req.files && req.files["coverLetterFile"] && req.files["coverLetterFile"][0];

  // Create new application
  const application = new Application({
    job: jobId,
    applicant: userId,
    fullName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    coverLetterText: req.body.coverLetterText || null,
    coverLetterFile: coverLetterFile
      ? { url: coverLetterFile.path, filename: coverLetterFile.filename }
      : undefined,
    resume: {
      url: resumeFile.path,
      filename: resumeFile.filename,
    },
    linkedIn: req.body.linkedIn || null,
    portfolio: req.body.portfolio || null,
  });

  await application.save();

  req.flash("success", "Application submitted successfully!");
  res.redirect(`/jobs/${jobId}`);
};

// =======================
// Employer routes
// =======================

// View applicants for a job
module.exports.viewApplicants = async (req, res) => {
  const { jobId } = req.params;
  const { status, search } = req.query;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      req.flash("error", "Job not found.");
      return res.redirect("/employers/jobs");
    }

    if (!job.owner.equals(req.user._id)) {
      req.flash(
        "error",
        "You are not allowed to view applicants for this job.",
      );
      return res.redirect("/employers/jobs");
    }

    let applicants = await Application.find({ job: jobId }).populate(
      "applicant",
    );

    if (status && status !== "All") {
      applicants = applicants.filter((app) => app.status === status);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      applicants = applicants.filter(
        (app) =>
          regex.test(app.applicant.username) || regex.test(app.applicant.email),
      );
    }

    res.render("applications/viewApplicants", {
      job,
      applicants,
      status,
      search,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Cannot fetch applicants right now.");
    res.redirect("/employers/jobs");
  }
};

// =======================
// Candidate: Withdraw Application
// =======================
module.exports.withdrawApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    req.flash("error", "Application not found.");
    return res.redirect("/applications/my-applications");
  }
  if (!application.applicant.equals(req.user._id)) {
    req.flash("error", "You are not allowed to withdraw this application.");
    return res.redirect("/applications/my-applications");
  }
  if (application.status !== "Pending") {
    req.flash("error", "You can only withdraw a pending application.");
    return res.redirect("/applications/my-applications");
  }
  await Application.findByIdAndDelete(req.params.id);
  req.flash("success", "Application withdrawn successfully.");
  res.redirect("/applications/my-applications");
};

// =======================
// Employer: Remove Application
// =======================
module.exports.removeApplication = async (req, res) => {
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) {
    req.flash("error", "Application not found.");
    return res.redirect("/employers/jobs");
  }
  if (!application.job.owner.equals(req.user._id)) {
    req.flash("error", "You are not allowed to remove this application.");
    return res.redirect("/employers/jobs");
  }
  const jobId = application.job._id;
  await Application.findByIdAndDelete(req.params.id);
  req.flash("success", "Application removed.");
  res.redirect(`/applications/${jobId}/applicants`);
};

// =======================
// Candidate: My Applications
// =======================
module.exports.myApplications = async (req, res) => {
  const { status, search } = req.query;

  const allApplications = await Application.find({
    applicant: req.user._id,
  }).populate("job");
  let applications = allApplications;

  if (status && status !== "All") {
    applications = applications.filter((app) => app.status === status);
  }

  if (search) {
    const regex = new RegExp(search, "i");
    applications = applications.filter((app) => regex.test(app.job.title));
  }

  res.render("applications/myApplications", {
    applications,
    status,
    search,
    totalApplications: allApplications.length,
  });
};
