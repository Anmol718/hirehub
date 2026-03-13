const Job = require("../models/jobs.js");
const Application = require("../models/application.js");

// Employer Dashboard
module.exports.dashboard = async (req, res) => {
  try {
    const myJobs = await Job.find({ owner: req.user._id });
    const jobIds = myJobs.map(j => j._id);

    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const pendingApplications = await Application.countDocuments({ job: { $in: jobIds }, status: "Pending" });
    const acceptedApplications = await Application.countDocuments({ job: { $in: jobIds }, status: "Accepted" });

    res.render("employers/dashboard.ejs", {
      jobsCount: myJobs.length,
      totalApplications,
      pendingApplications,
      acceptedApplications,
    });
  } catch (e) {
    req.flash("error", "Cannot load dashboard.");
    res.redirect("/home");
  }
};

// Show only jobs created by logged-in employer
module.exports.showJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("employers/employers.ejs", { jobs });
  } catch (e) {
    req.flash("error", "Cannot fetch jobs at the moment.");
    res.redirect("/home");
  }
};
