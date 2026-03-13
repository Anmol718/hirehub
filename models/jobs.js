const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract", "Internship"],
  },
  workMode: {
    type: String,
    enum: ["Onsite", "Remote", "Hybrid"],
  },
  experienceLevel: {
    type: String,
    enum: ["Entry", "Mid", "Senior"],
  },
  salary: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  skills: [
    {
      type: String,
    },
  ],
  postedAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
