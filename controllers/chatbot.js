const Anthropic = require("@anthropic-ai/sdk");
const Job = require("../models/jobs.js");
const Chat = require("../models/chat.js");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const buildSystemPrompt = (jobs) => {
  const jobList = jobs
    .map(
      (j) =>
        `- "${j.title}" at ${j.company} | ${j.location} | ${j.jobType} | ${j.workMode} | ${j.experienceLevel} level${
          j.salary ? ` | $${j.salary.toLocaleString()} CAD/yr` : ""
        } | Skills: ${j.skills.length ? j.skills.join(", ") : "Not specified"}`,
    )
    .join("\n");

  return `You are HireHub Assistant — a friendly, knowledgeable career advisor embedded in HireHub, a campus-to-career job portal. Your goal is to help candidates find the right jobs, write great application materials, and navigate their job search confidently.

## Current HireHub Job Listings (${jobs.length} active jobs)
${jobList || "No jobs currently listed."}

## Your Capabilities
- **Job matching**: Recommend specific jobs from the listings above based on the user's skills, experience, or preferences
- **Cover letter writing**: Help craft personalized, compelling cover letters for specific roles
- **Resume tips**: Provide guidance on resume formatting, content, and tailoring to job descriptions
- **Interview prep**: Share tips and practice questions tailored to specific roles or companies
- **Career advice**: Offer guidance on career paths, skill development, and job search strategy

## Guidelines
- Be encouraging, professional, and concise
- When recommending jobs, reference specific listings from the database above by title and company name
- If asked about jobs not in the current listings, explain you can only see active HireHub listings
- Format responses clearly using bullet points or numbered lists when helpful
- Keep responses focused and actionable
- When a user shares their skills or background, tailor recommendations specifically to them`;
};

module.exports.renderChat = async (req, res) => {
  const chat = await Chat.findOne({ user: req.user._id });
  const messages = chat ? chat.messages : [];
  res.render("chatbot/index.ejs", { messages });
};

module.exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = new Chat({ user: req.user._id, messages: [] });
    }

    const userText = message.trim();
    chat.messages.push({ role: "user", content: userText });

    const jobs = await Job.find({}).limit(50).lean();
    const systemPrompt = buildSystemPrompt(jobs);

    // Use last 20 messages to stay within context limits
    const historyForAPI = chat.messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: historyForAPI,
    });

    const assistantText = response.content[0].text;
    chat.messages.push({ role: "assistant", content: assistantText });
    await chat.save();

    res.json({ message: assistantText });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports.clearHistory = async (req, res) => {
  await Chat.findOneAndDelete({ user: req.user._id });
  req.flash("success", "Chat history cleared.");
  res.redirect("/chatbot");
};
