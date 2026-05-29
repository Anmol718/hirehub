# HireHub — AI-Powered Job Portal 🚀

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white)

> A full-stack AI-powered job portal built from scratch and deployed to production — connecting candidates with employers through intelligent matching and real-time AI assistance.

🔗 **Live Demo:** [hirehub-w6sp.onrender.com](https://hirehub-w6sp.onrender.com/home)  
💻 **GitHub:** [github.com/Anmol718/hirehub](https://github.com/Anmol718/hirehub)

---

## 📸 Screenshots

### 🏠 Homepage
<img width="1439" height="857" alt="Screenshot 2026-05-29 at 2 55 25 PM" src="https://github.com/user-attachments/assets/5bb9225e-6099-40b1-acbb-8db41e6b661f" />

### 🤖 AI Chatbot (Claude API — SSE Streaming)
<img width="1439" height="857" alt="Screenshot 2026-05-29 at 2 57 12 PM" src="https://github.com/user-attachments/assets/db1c678b-3391-41d8-9747-4cc6324f9722" />

### 📊 AI Resume Screening (Match Scores)
<img width="1439" height="857" alt="Screenshot 2026-05-29 at 2 57 44 PM" src="https://github.com/user-attachments/assets/5504db90-424f-4c89-9d7f-8f8f0331ccf2" />

### 📊 AI Screening with scores
<img width="1439" height="857" alt="Screenshot 2026-05-29 at 2 57 54 PM" src="https://github.com/user-attachments/assets/25fa70a7-ba5c-4e19-aec3-7c4b7f23bba2" />

### 💼 Employer Dashboard
<img width="1439" height="857" alt="Screenshot 2026-05-29 at 2 58 24 PM" src="https://github.com/user-attachments/assets/b70743e0-5526-4f37-b663-2a2846427ab6" />

### 🛡️ Admin Panel
<img width="1439" height="857" alt="Screenshot 2026-05-29 at 2 58 55 PM" src="https://github.com/user-attachments/assets/4aecbd93-9f25-4b57-a4e2-6b40f38cd0bb" />


---
## ✨ What Makes HireHub Different

Most job portals just list jobs. HireHub uses **Claude AI API** to actively help candidates and employers — screening resumes automatically, matching candidates by skill, and providing a real-time AI career assistant.

---

## 🤖 AI Features (Powered by Claude API)

### Real-Time AI Chatbot
- Built with **Server-Sent Events (SSE) streaming** — responses stream token by token like ChatGPT
- Integrated with **AJAX** for seamless real-time updates
- Career advisor & job matcher — helps candidates with cover letters, interview tips, and job search
- Powered by **Claude Haiku API** with **prompt caching** — 90% reduction in token costs

### AI Resume Screening
- Automatically reads and analyzes every candidate's resume
- Generates a **match score out of 100** for each applicant
- Ranks candidates by skills, experience, and job fit
- Employers can **re-screen** any time new applicants arrive
- Results cached for performance optimization

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

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Frontend | React.js + Bootstrap 5 |
| Database | MongoDB + Mongoose |
| AI | Claude Haiku API (Anthropic) |
| Authentication | Passport.js (Local Strategy) |
| File Uploads | Multer + Cloudinary |
| Email | Brevo HTTP API |
| Cloud | Render + MongoDB Atlas |
| Storage | Cloudinary |
| Monitoring | UptimeRobot |
| Security | Helmet.js, bcrypt, reCAPTCHA, Rate Limiting |

---

## ✅ Full Feature List

### 👤 Role-Based Authentication
- Three user roles: **Candidate, Employer, Admin**
- Secure session-based auth using Passport.js
- Role-aware navigation and access control middleware

### 🤖 AI Chatbot (Claude API)
- Real-time SSE streaming responses
- Quick action buttons — Jobs in Toronto, Write cover letter, Match my skills, Interview tips
- AJAX integration for seamless UX
- Prompt caching for 90% cost reduction

### 📊 AI Resume Screening
- Automatic candidate ranking with match scores
- Skill tag extraction and matching
- Re-screening on demand
- Results cached for performance

### 💼 Job Listings (Employers)
- Post, edit, and delete job listings
- Set job type, work mode, salary, location, experience level
- View all applications per listing
- Jobs require admin approval before going live

### 📄 Job Applications (Candidates)
- Browse and filter job listings
- Apply with resume (PDF) and cover letter
- Track application status in real time
- Files stored securely on Cloudinary

### 📧 Automated Email Notifications
- Candidates notified automatically on accept/reject
- Powered by Brevo HTTP API
- Professional email templates

### 🛡️ Admin Panel
- Full admin dashboard with live stats
- Manage all users, jobs, and applications
- Approve or reject job listings before going live
- Separate dark-themed admin layout

### 📱 Mobile Responsive
- Fully responsive across all screen sizes
- Mobile-first design approach
- Bootstrap 5 grid system throughout

---

## 🔐 User Roles

| Role | Permissions |
|---|---|
| Candidate | Browse jobs, apply with resume/cover letter, track status, use AI chatbot |
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
│   ├── jobs.js                     # Job CRUD + moderation
│   ├── applications.js            # Apply, view, status updates
│   ├── employers.js               # Employer dashboard
│   ├── chatbot.js                 # Claude AI SSE streaming
│   └── admin.js                   # Admin panel logic
├── routes/
│   ├── user.js
│   ├── jobs.js
│   ├── applications.js
│   ├── employers.js
│   ├── admin.js
│   ├── chatbot.js
│   └── middleware.js              # Auth, role-check, rate limiting
├── views/
│   ├── layouts/
│   │   ├── boilerplate.ejs        # Main layout
│   │   └── adminBoilerplate.ejs  # Admin layout
│   └── ...
├── utils/
│   ├── mailer.js                  # Brevo email utility
│   ├── wrapAsync.js               # Async error wrapper
│   └── ExpressError.js           # Custom error class
└── public/                        # Static assets + React components
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

### Installation

```bash
# Clone the repository
git clone https://github.com/Anmol718/hirehub.git
cd hirehub

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

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
```

### Run the App

```bash
node app.js
```

Visit: `http://localhost:3000`

---

## ☁️ Deployment

| Service | Purpose |
|---|---|
| Render | Node.js app hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | File storage (resumes, cover letters) |
| UptimeRobot | Server monitoring & uptime |

---

## 👨‍💻 Author

**Anmol Rehal**  
Computer Science (Honours) — Algoma University, Brampton  
Chancellor's Award Recipient

- 🔗 LinkedIn: [linkedin.com/in/anmolrehal](https://linkedin.com/in/anmolrehal)
- 💻 GitHub: [github.com/Anmol718](https://github.com/Anmol718)
- 📧 Email: anmolkumarrehal@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
