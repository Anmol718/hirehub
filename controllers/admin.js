const User = require("../models/user.js");
const Job = require("../models/jobs.js");
const Application = require("../models/application.js");

module.exports.dashboard = async (req, res) => {
  const jobCount = await Job.countDocuments();
  const userCount = await User.countDocuments();
  const applicationCount = await Application.countDocuments();
  const pendingCount = await Application.countDocuments({ status: "Pending" });
  const pendingJobsCount = await Job.countDocuments({ status: "pending" });

  res.render("admin/dashboard.ejs", {
    jobCount,
    userCount,
    applicationCount,
    pendingCount,
    pendingJobsCount,
    title: "Admin Dashboard",
  });
};

// Jobs
module.exports.manageJobs = async (req, res) => {
  const { filter: statusFilter } = req.query;
  const query = statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
  const jobs = await Job.find(query).populate("owner").sort({ postedAt: -1 });
  const pendingJobsCount = await Job.countDocuments({ status: "pending" });
  const allJobsCount = await Job.countDocuments();
  res.render("admin/manageJobs.ejs", {
    jobs,
    pendingJobsCount,
    allJobsCount,
    currentFilter: statusFilter || "all",
    title: "Manage Jobs",
  });
};

module.exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  await Application.deleteMany({ job: id });
  await Job.findByIdAndDelete(id);
  req.flash("success", "Job deleted successfully!");
  res.redirect("/admin/jobs");
};

module.exports.approveJob = async (req, res) => {
  await Job.findByIdAndUpdate(req.params.id, { status: "approved" });
  req.flash("success", "Job approved and is now live.");
  res.redirect("/admin/jobs?filter=pending");
};

module.exports.rejectJob = async (req, res) => {
  await Job.findByIdAndUpdate(req.params.id, { status: "rejected" });
  req.flash("success", "Job rejected.");
  res.redirect("/admin/jobs?filter=pending");
};

// Users
module.exports.manageUsers = async (req, res) => {
  const users = await User.find({});
  res.render("admin/manageUsers.ejs", { users, title: "Manage Users" });
};
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const jobs = await Job.find({ owner: id });
  const jobIds = jobs.map((j) => j._id);
  await Application.deleteMany({ job: { $in: jobIds } });
  await Job.deleteMany({ owner: id });
  await Application.deleteMany({ applicant: id });
  await User.findByIdAndDelete(id);
  req.flash("success", "User deleted successfully!");
  res.redirect("/admin/users");
};

// Applications
module.exports.manageApplications = async (req, res) => {
  const { status } = req.query;
  const filter = status && status !== "All" ? { status } : {};

  const applications = await Application.find(filter)
    .populate("applicant")
    .populate("job");

  const allApplications = await Application.find({});

  res.render("admin/manageApplications.ejs", {
    applications,
    allApplications,
    query: req.query,
    title: "Manage Applications",
  });
};

module.exports.deleteApplication = async (req, res) => {
  await Application.findByIdAndDelete(req.params.id);
  req.flash("success", "Application deleted successfully!");
  res.redirect("/admin/applications");
};
