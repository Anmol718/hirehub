const Anthropic = require("@anthropic-ai/sdk");
const { PDFParse } = require("pdf-parse");
const { cloudinary } = require("../cloudConfig.js");
const Job = require("../models/jobs.js");
const Application = require("../models/application.js");

const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

    const hasScreening = applicants.some(
      (a) => a.aiScreening && a.aiScreening.screenedAt
    );
    if (hasScreening) {
      applicants.sort((a, b) => {
        const sA = (a.aiScreening && a.aiScreening.score) || 0;
        const sB = (b.aiScreening && b.aiScreening.score) || 0;
        return sB - sA;
      });
    }

    res.render("applications/viewApplicants", {
      job,
      applicants,
      status,
      search,
      hasScreening,
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
// Employer: AI Resume Screening
// =======================
module.exports.screenResumes = async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    req.flash("error", "Job not found.");
    return res.redirect("/employers/jobs");
  }
  if (!job.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorised to screen these resumes.");
    return res.redirect("/employers/jobs");
  }

  const applications = await Application.find({ job: jobId }).populate("applicant");

  const jobContext = [
    `Job Title: ${job.title}`,
    `Company: ${job.company}`,
    `Location: ${job.location}`,
    job.jobType ? `Type: ${job.jobType}` : "",
    job.experienceLevel ? `Experience Level: ${job.experienceLevel}` : "",
    `Description:\n${job.description}`,
    job.skills.length ? `Required Skills: ${job.skills.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  let screened = 0;
  let skipped = 0;

  for (const app of applications) {
    if (app.aiScreening && app.aiScreening.screenedAt) {
      skipped++;
      continue;
    }

    try {
      const signedUrl = cloudinary.url(app.resume.filename, {
        resource_type: "raw",
        type: "upload",
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 300,
      });

      const pdfResponse = await fetch(signedUrl);
      if (!pdfResponse.ok) throw new Error("Failed to download resume PDF");
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      await parser.destroy();
      const resumeText = pdfData.text.trim() || "(No text could be extracted from this PDF)";

      const prompt = `You are an expert technical recruiter. Evaluate the candidate's resume against the job description and return ONLY a valid JSON object — no explanation, no markdown.

${jobContext}

Candidate Resume:
${resumeText.slice(0, 6000)}

Respond with exactly this JSON structure:
{
  "score": <integer 0-100 representing overall fit>,
  "matchingSkills": [<skills from the job requirements that the candidate clearly has>],
  "missingSkills": [<skills from the job requirements that the candidate lacks>],
  "recommendation": "<exactly one of: Strong Hire, Hire, Consider, Reject>"
}`;

      const message = await anthropicClient.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      });

      const raw = message.content[0].text.trim();
      const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      const result = JSON.parse(jsonStr);

      app.aiScreening = {
        score: Math.max(0, Math.min(100, Number(result.score) || 0)),
        matchingSkills: Array.isArray(result.matchingSkills) ? result.matchingSkills : [],
        missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
        recommendation: result.recommendation || "Consider",
        screenedAt: new Date(),
      };
      await app.save();
      screened++;
    } catch (err) {
      console.error(`AI screening failed for application ${app._id}:`, err.message);
    }
  }

  if (screened > 0) {
    req.flash("success", `AI screening complete — ${screened} resume${screened !== 1 ? "s" : ""} screened${skipped > 0 ? `, ${skipped} already cached` : ""}.`);
  } else if (skipped > 0) {
    req.flash("success", "All resumes were already screened. Results shown below.");
  } else {
    req.flash("error", "No resumes could be screened.");
  }

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
