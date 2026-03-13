const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    resume: {
      type: {
        url: { type: String },
        filename: { type: String },
      },
      required: true, // ✅ this is valid
    },
    coverLetterText: { type: String },
    coverLetterFile: {
      url: { type: String },
      filename: { type: String },
    },
    linkedIn: String,
    portfolio: String,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
