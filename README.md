# HireHub — Campus-to-Career Job Portal

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

A full-stack web application that connects university students with employers — built from scratch with Node.js, Express, and MongoDB.

🔗 **Live Demo:** [https://hirehub-w6sp.onrender.com/home](https://hirehub-w6sp.onrender.com/home)

> ⚠️ Hosted on Render's free tier — may take 30–60 seconds to wake up on first visit.

---

## 📸 Screenshots

> _(Add screenshots of your homepage, job listings, and admin panel here)_

---

## ✨ Features

### 👤 Role-Based Authentication

- Three user roles: **Candidate**, **Employer**, and **Admin**
- Secure session-based authentication using **Passport.js** (local strategy)
- Role-aware navigation and access control middleware

### 💼 Job Listings (Employers)

- Post, edit, and delete job listings
- Set job title, description, salary (CAD), location, and type
- View all applications submitted to their listings

### 📄 Job Applications (Candidates)

- Browse and apply to job listings
- Upload **resume** (PDF) and optional **cover letter** (text or PDF)
- Files securely stored on **Cloudinary**
- Track application status in real time

### 📬 Email Notifications

- Automated email alerts sent to candidates when their application is **accepted** or **rejected**
- Powered by the **Brevo (Sendinblue) HTTP API**

### 🛡️ Admin Panel

- Dedicated dark-themed admin dashboard
- Manage all **users**, **job listings**, and **applications**
- Separate admin layout (`adminBoilerplate.ejs`)

### 🔔 Flash Notifications

- Auto-dismissing toast notifications (4 seconds) for all user actions
- Success, error, and info states

### ❌ Error Handling

- Custom error pages with status-aware messages (401, 403, 404, 500)
- `ExpressError` utility class + `wrapAsync` for clean async error handling

---

## 🛠️ Tech Stack

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| Runtime        | Node.js                                        |
| Framework      | Express.js                                     |
| Database       | MongoDB + Mongoose                             |
| Templating     | EJS + ejs-mate (layouts)                       |
| Authentication | Passport.js (Local Strategy)                   |
| File Uploads   | Multer + Cloudinary                            |
| Email          | Brevo HTTP API                                 |
| Styling        | Bootstrap 5.3 + Bootstrap Icons + Font Awesome |
| Hosting        | Render (free tier)                             |

---

## 📁 Project Structure

```
hirehub/
├── app.js                          # Entry point
├── models/
│   ├── user.js                     # User schema (candidate/employer/admin)
│   ├── jobs.js                     # Job listing schema
│   └── application.js              # Application schema
├── controllers/
│   ├── users.js                    # Auth, register, login, logout
│   ├── jobs.js                     # Job CRUD
│   ├── applications.js             # Apply, view, status updates
│   ├── employers.js                # Employer dashboard
│   └── admin.js                    # Admin panel logic
├── routes/
│   ├── user.js
│   ├── jobs.js
│   ├── applications.js
│   ├── employers.js
│   ├── admin.js
│   └── middleware.js               # Auth & role-check middleware
├── views/
│   ├── layouts/
│   │   ├── boilerplate.ejs         # Main layout
│   │   └── adminBoilerplate.ejs    # Admin layout
│   └── ...                         # Page views
├── utils/
│   ├── mailer.js                   # Brevo email utility
│   ├── wrapAsync.js                # Async error wrapper
│   └── ExpressError.js             # Custom error class
└── public/                         # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally
- Cloudinary account
- Brevo (Sendinblue) account for email

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Anmol718/hirehub.git
cd hirehub
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/hirehub

# Session
SESSION_SECRET=your_session_secret_here

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Email (Brevo)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_brevo_api_key
```

4. **Start the server**

```bash
node app.js
```

5. **Visit the app**

```
http://localhost:8080
```

---

## 🔐 User Roles

| Role          | Permissions                                                           |
| ------------- | --------------------------------------------------------------------- |
| **Candidate** | Browse jobs, apply with resume/cover letter, track application status |
| **Employer**  | Post/edit/delete job listings, view and manage applications           |
| **Admin**     | Full access — manage all users, jobs, and applications                |

---

## 📧 Email Notifications

HireHub uses the **Brevo HTTP API** to send transactional emails. Candidates receive automatic notifications when:

- ✅ Their application is **accepted**
- ❌ Their application is **rejected**

---

## ☁️ File Uploads

Resumes and cover letters are uploaded using **Multer** and stored on **Cloudinary**. This ensures:

- Files persist independently of the server
- Secure, CDN-delivered file access
- Support for PDF format

---

## 👨‍💻 Author

**Anmol Rehal**

- LinkedIn: [linkedin.com/in/anmolrehal](https://www.linkedin.com/in/anmolrehal)
- GitHub: [github.com/Anmol718](https://github.com/Anmol718)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
