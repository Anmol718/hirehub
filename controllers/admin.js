const User = require("../models/user.js");
const Job = require("../models/jobs.js");
const Application = require("../models/application.js");

module.exports.dashboard = async (req, res) => {
  const jobCount = await Job.countDocuments();
  const userCount = await User.countDocuments();
  const applicationCount = await Application.countDocuments();
  const pendingCount = await Application.countDocuments({ status: "Pending" });

  res.render("admin/dashboard.ejs", {
    jobCount,
    userCount,
    applicationCount,
    pendingCount,
    title: "Admin Dashboard",
  });
};

// Jobs
module.exports.manageJobs = async (req, res) => {
  const jobs = await Job.find({}).populate("owner");
  res.render("admin/manageJobs.ejs", { jobs, title: "Manage Jobs" });
};
module.exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  await Application.deleteMany({ job: id });
  await Job.findByIdAndDelete(id);
  req.flash("success", "Job deleted successfully!");
  res.redirect("/admin/jobs");
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
