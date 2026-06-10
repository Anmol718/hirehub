const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert AI Interview Coach embedded in HireHub, a campus-to-career job portal. You guide candidates through a structured 4-step process:

Step 1 — Analyze the job title to understand core requirements, key skills, and typical interview focus areas.
Step 2 — Generate 5 tailored, role-specific interview questions spanning behavioral, technical, and situational categories.
Step 3 — Evaluate candidate answers with expert depth, assessing communication clarity, technical accuracy, and industry alignment.
Step 4 — Deliver scored feedback with a numeric score (1–10) and specific, actionable improvement advice for each answer.

## Scoring Guidelines
- 9–10: Exceptional — exceeds expectations with depth and insight
- 7–8: Strong — solid answer with minor gaps
- 5–6: Adequate — covers basics but lacks depth or specifics
- 3–4: Weak — misses key points or is too vague
- 1–2: Insufficient — off-topic or no meaningful content

## Rules
- Questions must range from behavioral (STAR-method) to technical to situational
- Feedback must be specific and actionable — never generic filler
- Always respond with valid JSON in the exact schema requested
- Never include any text, markdown, or commentary outside the JSON`;

function extractJSON(text) {
  if (!text || typeof text !== "string") throw new Error("Empty or invalid model response");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON object found in response");
  const jsonStr = text.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    throw new Error(`Invalid JSON from model: ${err.message}`);
  }
}

module.exports.renderInterview = (req, res) => {
  res.render("sections/interview.ejs");
};

module.exports.generateQuestions = async (req, res) => {
  const { jobTitle } = req.body;

  if (!jobTitle || !jobTitle.trim()) {
    return res.status(400).json({ error: "Job title is required." });
  }

  const title = jobTitle.trim().slice(0, 120);

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Steps 1 & 2: Analyze this job title and generate 5 tailored interview questions.

Job Title: "${title}"

Analyze what skills, experience, and qualities matter most for this role, then generate 5 diverse questions covering:
- 2 behavioral questions (past experience, STAR method)
- 2 technical or role-specific knowledge questions
- 1 situational or problem-solving question

Respond ONLY with this exact JSON schema:
{
  "roleAnalysis": "1–2 sentence summary of the role's core requirements and focus areas",
  "questions": [
    "Question 1 text",
    "Question 2 text",
    "Question 3 text",
    "Question 4 text",
    "Question 5 text"
  ]
}`,
        },
      ],
    });

    const text = response && response.content && response.content[0] && response.content[0].text;
    if (!text) {
      console.error("Anthropic response missing text:", response);
      return res.status(502).json({ error: "AI service returned an unexpected response." });
    }

    const parsed = extractJSON(text);
    return res.json(parsed);
  } catch (err) {
    console.error("generateQuestions error:", err);
    return res.status(502).json({ error: "Failed to generate questions from AI service." });
  }
};

module.exports.evaluateAnswers = async (req, res) => {
  const { jobTitle, answers } = req.body;

  if (!jobTitle || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Job title and answers are required." });
  }

  const title = jobTitle.trim().slice(0, 120);

  const qaText = answers
    .map(
      (qa, i) =>
        `Q${i + 1}: ${qa.question}\nA${i + 1}: ${(qa.answer || "").trim() || "(No answer provided)"}`,
    )
    .join("\n\n");

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Steps 3 & 4: Evaluate these interview answers for a "${title}" position and provide scored feedback.

${qaText}

For each answer apply the scoring rubric and provide honest evaluation. Empty or very short answers should score 1–2.

Respond ONLY with this exact JSON schema:
{
  "overallScore": <integer average of all scores>,
  "overallSummary": "2–3 sentence overall performance summary with specific encouragement",
  "results": [
    {
      "question": "exact question text",
      "score": <integer 1–10>,
      "feedback": "specific evaluation of what the answer did well or missed",
      "tip": "one concrete, actionable improvement suggestion"
    }
  ]
}`,
        },
      ],
    });

    const text = response && response.content && response.content[0] && response.content[0].text;
    if (!text) {
      console.error("Anthropic response missing text:", response);
      return res.status(502).json({ error: "AI service returned an unexpected response." });
    }

    const parsed = extractJSON(text);
    return res.json(parsed);
  } catch (err) {
    console.error("evaluateAnswers error:", err);
    return res.status(502).json({ error: "Failed to evaluate answers from AI service." });
  }
};
