# HireHub 2.0 — AI Career Agent 🚀

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white)
![Azure AI Search](https://img.shields.io/badge/Azure_AI_Search-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![GitHub Copilot](https://img.shields.io/badge/GitHub_Copilot-000000?style=for-the-badge&logo=github&logoColor=white)

> A full-stack AI career agent built from scratch and deployed to production — connecting candidates with employers through intelligent semantic search, AI-powered interview coaching, and real-time AI assistance.

🏆 **Built for Microsoft Agents League Hackathon 2026** — Creative Apps Track  
🔗 **Live Demo:** [hirehub-w6sp.onrender.com](https://hirehub-w6sp.onrender.com/home)  
💻 **GitHub:** [github.com/Anmol718/hirehub](https://github.com/Anmol718/hirehub)

---

## 📸 Screenshots

### 🏠 Homepage
<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 54 06 PM" src="https://github.com/user-attachments/assets/42cf46eb-8cbc-4731-b319-890e26aa4940" />

### 🎤 AI Interview Coach (New in 2.0)
<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 54 44 PM" src="https://github.com/user-attachments/assets/7ac38aa2-dfce-4de1-9d3c-e5c3bca44696" />

<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 56 07 PM" src="https://github.com/user-attachments/assets/a7fcb3d4-e8cb-487a-b0b8-5eb7f91348a8" />

<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 57 20 PM" src="https://github.com/user-attachments/assets/c7946017-5586-457d-861c-ab264ccd158f" />




### 🎯 Interview Feedback with AI Scores (New in 2.0)

<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 58 03 PM" src="https://github.com/user-attachments/assets/dc571442-7160-43c8-bd9d-4609177b1277" />

<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 58 57 PM" src="https://github.com/user-attachments/assets/ccc108b9-4ee2-4d2f-9302-319658d647d4" />


<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 58 37 PM" src="https://github.com/user-attachments/assets/d157b161-70ea-44d8-807f-b2e2166d7e8f" />

### 🔍 Semantic Job Search — Azure AI Search / Foundry IQ (New in 2.0)

<img width="1439" height="900" alt="Screenshot 2026-06-10 at 5 59 35 PM" src="https://github.com/user-attachments/assets/80a8d05c-ced6-499a-816a-a07f20292b14" />

### 🤖 AI Chatbot (Claude API — SSE Streaming)
<img width="1439" height="857" alt="AI Chatbot" src="https://github.com/user-attachments/assets/db1c678b-3391-41d8-9747-4cc6324f9722" />

### 📊 AI Resume Screening (Match Scores)
<img width="1439" height="857" alt="AI Resume Screening" src="https://github.com/user-attachments/assets/5504db90-424f-4c89-9d7f-8f8f0331ccf2" />

<img width="1439" height="857" alt="AI Screening with scores" src="https://github.com/user-attachments/assets/25fa70a7-ba5c-4e19-aec3-7c4b7f23bba2" />

### 💼 Employer Dashboard
<img width="1439" height="857" alt="Employer Dashboard" src="https://github.com/user-attachments/assets/b70743e0-5526-4f37-b663-2a2846427ab6" />

### 🛡️ Admin Panel
<img width="1439" height="857" alt="Admin Panel" src="https://github.com/user-attachments/assets/4aecbd93-9f25-4b57-a4e2-6b40f38cd0bb" />

---

## 🆕 What's New in HireHub 2.0

HireHub 2.0 was built for the **Microsoft Agents League Hackathon 2026**, adding two major AI agent features on top of the existing production platform:

### 🎤 AI Interview Coach (Multi-Step Agent)
A 4-step reasoning agent that helps candidates prepare for any role:
1. **Analyze Role** — Claude AI analyzes the target job title and generates a role summary
2. **Generate Questions** — 5 tailored behavioural and technical interview questions
3. **Candidate Answers** — User answers each question in their own words
4. **Score & Feedback** — Claude scores each answer with color-coded badges and detailed coaching feedback

### 🔍 Azure AI Search — Foundry IQ Integration
Semantic job search powered by **Microsoft Foundry IQ (Azure AI Search)**:
- Jobs are automatically indexed into Azure AI Search on create, approve, update, and delete
- Semantic ranking understands intent — "remote developer" finds relevant roles even without exact keyword matches
- Graceful MongoDB fallback if Azure is unavailable
- Real-time index sync across all job lifecycle events

---

## ✨ What Makes HireHub Different

Most job portals just list jobs. HireHub uses **Claude AI API** and **Azure AI Search** to actively help candidates and employers — coaching candidates through mock interviews, screening resumes automatically, matching candidates by skill, and providing a real-time AI career assistant — all in one deployed, production-ready platform.

---

## 🤖 AI Features

### 🎤 AI Interview Coach (New in 2.0)
- **4-step multi-step agent flow** powered by Claude API
- Role analysis → tailored question generation → answer collection → scored feedback
- Color-coded performance badges (Excellent / Good / Needs Work)
- Detailed coaching feedback on each answer
- Supports any job title or role

### 🔍 Semantic Job Search — Azure AI Search / Foundry IQ (New in 2.0)
- **Microsoft Foundry IQ** integration via Azure AI Search SDK
- Semantic ranking with `jobs-semantic-config`
- Auto-indexes jobs on every lifecycle event (create, approve, update, delete)
- Falls back gracefully to MongoDB text search if Azure is unavailable
- Filters on `status eq 'approved'` to surface only live jobs

### 💬 Real-Time AI Chatbot
- Built with **Server-Sent Events (SSE) streaming** — responses stream token by token
- Career advisor — helps candidates with cover letters, interview tips, and job search
- Powered by **Claude Haiku API** with **prompt caching** — ~90% reduction in token costs

### 📊 AI Resume Screening
- Automatically reads and analyzes every candidate's resume
- Generates a **match score out of 100** for each applicant
- Ranks candidates by skills, experience, and job fit
- Employers can re-screen any time new applicants arrive

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Frontend | EJS (server-side templating) + Bootstrap 5 |
| Database | MongoDB + Mongoose |
| AI | Claude Haiku API (Anthropic) |
| Semantic Search | Azure AI Search (Microsoft Foundry IQ) |
| Authentication | Passport.js (Local Strategy) |
| File Uploads | Multer + Cloudinary |
| Email | Brevo HTTP API |
| Cloud Hosting | Render + MongoDB Atlas |
| Storage | Cloudinary |
| Monitoring | UptimeRobot |
| Security | Helmet.js, bcrypt, reCAPTCHA, Rate Limiting |
| AI Dev Tool | GitHub Copilot |

---

## 🔒 Security Stack

| Feature | Implementation |
|---|---|
| Security Headers | Helmet.js — 14 HTTP security headers |
| Brute Force Protection | express-rate-limit |
| Password Security | bcrypt hashing |
| Bot Protection | Google reCAPTCHA v2 |
| Job Moderation | Admin approval before jobs go live |
| File Storage | Secure Cloudinary with Multer |
| Session Security | express-session with secure config |
| Input Validation | Schema validation with Joi |

---

## ✅ Full Feature List

### 👤 Role-Based Authentication
- Three user roles: **Candidate, Employer, Admin**
- Secure session-based auth using Passport.js
- Role-aware navigation and access control middleware

### 🎤 AI Interview Coach
- 4-step agent: role analysis → questions → answers → scored feedback
- Color-coded performance badges per answer
- Works for any job title or industry

### 🔍 Semantic Job Search
- Azure AI Search with semantic ranking
- Auto-sync on job create, approve, update, delete
- Graceful MongoDB fallback

### 💬 AI Chatbot
- Real-time SSE streaming responses
- Quick action buttons — Jobs in Toronto, Write cover letter, Match my skills, Interview tips
- Prompt caching for ~90% cost reduction

### 📊 AI Resume Screening
- Automatic candidate ranking with match scores
- Skill tag extraction and matching
- Re-screening on demand

### 💼 Job Listings (Employers)
- Post, edit, and delete job listings
- Set job type, work mode, salary, location, experience level
- Jobs require admin approval before going live

### 📄 Job Applications (Candidates)
- Browse and filter job listings
- Apply with resume (PDF) and cover letter
- Track application status in real time

### 📧 Automated Email Notifications
- Candidates notified automatically on accept/reject
- Powered by Brevo HTTP API

### 🛡️ Admin Panel
- Full admin dashboard with live stats
- Approve or reject job listings before going live
- Manage all users, jobs, and applications

### 📱 Mobile Responsive
- Fully responsive across all screen sizes
- Bootstrap 5 grid system throughout

---

## 🔐 User Roles

| Role | Permissions |
|---|---|
| Candidate | Browse jobs, apply with resume/cover letter, track status, use AI chatbot, use Interview Coach |
| Employer | Post/edit/delete jobs, view applicants, see AI screening scores |
| Admin | Full access — manage users, jobs, applications, approve listings |

---

## 📁 Project Structure

```
hirehub/
├── app.js                          # Entry point + security config
├── models/
│   ├── user.js                     # User schema (candidate/employer/admin)
│   ├── jobs.js                     # Job listing schema
│   └── application.js             # Application schema
├── controllers/
│   ├── users.js                    # Auth, register, login, logout
│   ├── jobs.js                     # Job CRUD + Azure index sync
│   ├── applications.js            # Apply, view, status updates
│   ├── employers.js               # Employer dashboard
│   ├── chatbot.js                 # Claude AI SSE streaming
│   ├── interview.js               # AI Interview Coach agent
│   └── admin.js                   # Admin panel + Azure index sync
├── routes/
│   ├── user.js
│   ├── jobs.js
│   ├── applications.js
│   ├── employers.js
│   ├── admin.js
│   ├── chatbot.js
│   ├── interview.js
│   └── middleware.js              # Auth, role-check, rate limiting
├── utils/
│   ├── searchService.js           # Azure AI Search (Foundry IQ) client
│   ├── mailer.js                  # Brevo email utility
│   ├── wrapAsync.js               # Async error wrapper
│   └── ExpressError.js           # Custom error class
└── views/
    ├── interview.ejs              # AI Interview Coach UI
    ├── layouts/
    │   ├── boilerplate.ejs        # Main layout
    │   └── adminBoilerplate.ejs  # Admin layout
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI
- Cloudinary account
- Brevo account for email
- Anthropic API key (Claude)
- Google reCAPTCHA keys
- Azure AI Search resource (Free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/Anmol718/hirehub.git
cd hirehub

# Install dependencies (use legacy peer deps)
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
# MongoDB
MONGO_URI=your_mongodb_uri

# Session
SESSION_SECRET=your_session_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Email (Brevo)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_brevo_api_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Google reCAPTCHA
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Azure AI Search (Foundry IQ)
AZURE_SEARCH_ENDPOINT=https://your-service.search.windows.net
AZURE_SEARCH_KEY=your_azure_search_key
AZURE_SEARCH_INDEX=jobs
```

### Run the App

```bash
node app.js
```

Visit: `http://localhost:8080`

---

## ☁️ Deployment

| Service | Purpose |
|---|---|
| Render | Node.js app hosting |
| MongoDB Atlas | Cloud database |
| Azure AI Search | Semantic job search (Foundry IQ) |
| Cloudinary | File storage (resumes, cover letters) |
| UptimeRobot | Server monitoring & uptime |

---

## 🏆 Hackathon Details

**Microsoft Agents League Hackathon 2026**
- Track: 🎨 Creative Apps
- Microsoft IQ Layer: Foundry IQ (Azure AI Search)
- AI Development Tool: GitHub Copilot
- Submission Deadline: June 14, 2026

---

## 👨‍💻 Author

**Anmol Rehal**  
CS Honours graduate, Algoma University Brampton — Chancellor's Award recipient (2026).  
Building AI-powered tools at the intersection of software and real-world problems.

- 🔗 LinkedIn: [linkedin.com/in/anmolrehal](https://linkedin.com/in/anmolrehal)
- 💻 GitHub: [github.com/Anmol718](https://github.com/Anmol718)
- 📧 Email: anmolkumarrehal@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
