// controllers/jobs.js
const Job = require("../models/jobs.js");
const Application = require("../models/application.js");

// Show all jobs
module.exports.index = async (req, res) => {
  const { jobType, search, location, page } = req.query;
  const filter = {};
  const JOBS_PER_PAGE = 9;
  const currentPage = Math.max(1, parseInt(page) || 1);

  if (jobType) filter.jobType = jobType;
  if (search) filter.$or = [
    { title: { $regex: search, $options: "i" } },
    { company: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } },
  ];
  if (location) filter.location = { $regex: location, $options: "i" };

  const totalJobs = await Job.countDocuments(filter);
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);
  const allJobs = await Job.find(filter)
    .sort({ postedAt: -1 })
    .skip((currentPage - 1) * JOBS_PER_PAGE)
    .limit(JOBS_PER_PAGE);

  res.render("sections/index.ejs", {
    allJobs,
    jobType,
    search,
    location,
    currentPage,
    totalPages,
    totalJobs,
  });
};

// Render new job form
module.exports.renderNewForm = async (req, res) => {
  res.render("sections/new.ejs");
};

// Show single job
module.exports.showJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id).populate("owner");
  if (!job) {
    req.flash("error", "Job not found!");
    return res.redirect("/jobs");
  }

  // Check if user already applied (optional)
  let userAlreadyApplied = false;
  if (req.user) {
    const Application = require("../models/application.js");
    const existingApplication = await Application.findOne({
      job: job._id,
      applicant: req.user._id,
    });
    userAlreadyApplied = !!existingApplication;
  }

  res.render("sections/show.ejs", { job, userAlreadyApplied });
};

// Create new job
module.exports.createJob = async (req, res) => {
  const newJobData = req.body.job;

  if (typeof newJobData.skills === "string") {
    newJobData.skills = newJobData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } else if (!Array.isArray(newJobData.skills)) {
    newJobData.skills = [];
  }

  const newJob = new Job(newJobData);
  newJob.owner = req.user._id;
  await newJob.save();

  req.flash("success", "New Job Post Created!");
  res.redirect("/jobs");
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    req.flash("error", "Job not found!");
    return res.redirect("/jobs");
  }
  res.render("sections/edit.ejs", { job });
};

// Update job
module.exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJobData = req.body.job;

  if (typeof updatedJobData.skills === "string") {
    updatedJobData.skills = updatedJobData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } else if (!Array.isArray(updatedJobData.skills)) {
    updatedJobData.skills = [];
  }

  await Job.findByIdAndUpdate(id, updatedJobData, { runValidators: true });
  req.flash("success", "Job Post Updated!");
  res.redirect(`/jobs/${id}`);
};

// Delete job
module.exports.destroyJob = async (req, res) => {
  const { id } = req.params;
  await Application.deleteMany({ job: id });
  await Job.findByIdAndDelete(id);
  req.flash("success", "Job Post Deleted!");
  res.redirect("/jobs");
};
