# LinkWurk

A full-stack job portal connecting candidates and recruiters — built solo as an internship project for Infobharat Interns.

**Live site:** [linkwurk.online](https://linkwurk.online) · **Repo:** [github.com/AdityaLour/linkwurk](https://github.com/AdityaLour/linkwurk)

---

## Contents

[Overview](#overview) · [Tech Stack](#tech-stack) · [Architecture](#architecture) · [Database Schema](#database-schema) · [API Reference](#api-reference) · [Installation](#installation) · [Deployment](#deployment) · [Screenshots](#screenshots)

---

## Overview

Three roles, one platform:

- **Candidates** build a profile (skills, education, resume), browse and search jobs, apply, save listings, and track each application through its stages — Applied → Under Review → Shortlisted → Interview → Selected/Rejected.
- **Recruiters** set up a company profile, post jobs with a live preview, review applicants, and schedule interviews.
- **Admins** get a platform-wide dashboard (growth graphs, recent activity), and can search, manage, deactivate, or verify any account.

The standout feature is **skill-based matching** — candidates see a live match percentage on every recommended job, computed from their profile skills against the job's requirements.

The UI follows a custom **neo-brutalist design system** — thick borders, hard offset shadows, a dot-grid background, and CSS-keyframe motion (no animation library).

---

## Tech Stack

| | |
|---|---|
| **Frontend** | React 18 (Vite), MUI (custom theme), React Router v6, Axios, Google Sign-In |
| **Backend** | Node.js, Express 5, Mongoose, `express-session` + `connect-mongo`, bcrypt, Multer + ImageKit, Resend, `google-auth-library` |
| **Database** | MongoDB Atlas |
| **Infra** | Vercel (frontend), Render (backend), UptimeRobot, custom domain via Hostinger |

Authentication is **session-based**, not JWT — JWT is used only for the one-time email verification link.

---

## Architecture

<img src="screenshots/architecture.png" width="750" alt="System architecture diagram"><img width="2200" height="1560" alt="architecture_excalidraw" src="https://github.com/user-attachments/assets/b6f902cf-556c-4315-a230-4c1a5b9e21c4" />


- Frontend and backend are deployed and hosted completely independently — the frontend is a static bundle on Vercel's CDN; the backend is a persistent Node process on Render, communicating purely over HTTPS.
- The session cookie is `secure: true, sameSite: 'none'` in production (required since frontend and backend live on different domains), falling back to `secure: false, sameSite: 'lax'` locally.
- Render sits behind a reverse proxy that terminates HTTPS internally — `app.set('trust proxy', 1)` tells Express to trust the forwarded-protocol header, without which secure cookies never get set at all.
- Role-based access control (`requireAuth`, `requireRole`) is enforced at the middleware layer on every protected route, not just hidden in the UI.

---

## Database Schema

| Collection | Key fields |
|---|---|
| **users** | firstName, lastName, email, password (bcrypt), role, authType, isActive, isEmailVerified |
| **candidates** | userId, profilePicture, summary, skills[], education[], resume, certifications[] |
| **recruiters** | userId, companyName, companyTagline, website, numberOfEmployees, companyLogo |
| **jobs** | recruiterId, title, location, isRemote, salaryMin/Max, skillsRequired[], experienceRequired, applicationType, status |
| **applications** | candidateId, jobId, status |
| **interviews** | applicationId, scheduledAt, status, notes |
| **savedjobs** | candidateId, jobId |
| **sessions** | managed automatically by `connect-mongo` |

---

## API Reference

Full request/response documentation for every endpoint — auth, jobs, applications, interviews, profiles, saved jobs, skills/universities, and admin routes — is published here:

**[LinkWurk API Documentation](https://documenter.getpostman.com/view/54324256/2sBY4WpcLs)**

---

## Installation

**Prerequisites:** Node 18+, a MongoDB instance, accounts for Resend, ImageKit, and Google Cloud Console (OAuth).

```bash
git clone https://github.com/AdityaLour/linkwurk.git
cd linkwurk
```

**Backend** — `cd server && npm install`, then create `server/.env`:
```env
MONGO_URI=*********************
CLIENT_URL=*********************
PORT=*********************
SESSION_SECRET=*********************
JWT_SECRET=*********************
GOOGLE_CLIENT_ID=*********************
ADMIN_SEED_PASSWORD=*********************
IMAGEKIT_PUBLIC_KEY=*********************
IMAGEKIT_PRIVATE_KEY=*********************
IMAGEKIT_URL_ENDPOINT=*********************
RESEND_API_KEY=*********************
```
Run with `npm run dev`.

**Frontend** — `cd client && npm install`, then create `client/.env`:
```env
VITE_API_URL=*********************
VITE_GOOGLE_CLIENT_ID=*********************
```
Run with `npm run dev` — app runs at `http://localhost:5173`.

---

## Deployment

| Service | Role | Key settings |
|---|---|---|
| **MongoDB Atlas** | Database | M0 free cluster · Network Access set to `0.0.0.0/0` (Render has no fixed IP) |
| **Render** | Backend | Root: `server` · Build: `npm install` · Start: `npm start` · `MONGO_URI` → Atlas string · `CLIENT_URL` → live frontend URL · `NODE_ENV=production` |
| **Vercel** | Frontend | Root: `client` · `VITE_API_URL` → live Render URL · `vercel.json` rewrites all paths to `index.html` (required for a client-routed SPA — without it, refreshing any non-root page 404s) |
| **Hostinger** | Domain | `linkwurk.online` DNS-connected to Vercel; `CLIENT_URL` and Google's Authorized JavaScript Origins updated to match |
| **UptimeRobot** | Uptime | Pings `/health` every 5 min so Render's free tier never cold-starts (15-min idle spin-down otherwise) |

---

## Screenshots

**Landing page**
<img width="1897" height="991" alt="Screenshot 2026-08-12 192054" src="https://github.com/user-attachments/assets/69dc6b9e-8b13-4f9e-ad70-245ebd786177" />

**Candidate dashboard**
<img src="screenshots/candidate-dashboard.png" width="750"><img width="1904" height="1002" alt="Screenshot 2026-08-12 192907" src="https://github.com/user-attachments/assets/d14c389b-dac3-4942-a7c3-5d691a8da400" />


**Job browsing & filters**
<img src="screenshots/job-browsing.png" width="750"><img width="1896" height="988" alt="Screenshot 2026-08-12 193021" src="https://github.com/user-attachments/assets/d8886c52-1b7d-4e57-bc9a-145914963eff" />


**Job detail**
<img src="screenshots/job-detail.png" width="600"><img width="1919" height="991" alt="Screenshot 2026-08-12 193111" src="https://github.com/user-attachments/assets/c6511d7b-708a-4e55-8a4b-0279b2f8304a" />


**Recruiter dashboard**
<img src="screenshots/recruiter-dashboard.png" width="750"><img width="1918" height="998" alt="Screenshot 2026-08-12 193305" src="https://github.com/user-attachments/assets/d3da8c86-69c4-4e1b-9c6d-2ef4d98b4491" />


**Job posting with live preview**
<img src="screenshots/job-posting-form.png" width="600"><img width="1898" height="995" alt="Screenshot 2026-08-12 193357" src="https://github.com/user-attachments/assets/af945778-f2da-4320-92e4-1fb64a787eaa" />


**Applicant review**
<img src="screenshots/applicant-review.png" width="750"><img width="1919" height="987" alt="Screenshot 2026-08-12 193544" src="https://github.com/user-attachments/assets/43483d7f-6fb7-426e-a051-2fc8787718ec" />


**Admin dashboard**
<img src="screenshots/admin-dashboard.png" width="750"><img width="1221" height="795" alt="Screenshot 2026-08-12 193742" src="https://github.com/user-attachments/assets/a79cf69b-dbb9-48eb-8b8e-21c4e631e899" />
<img width="1908" height="992" alt="Screenshot 2026-08-12 193713" src="https://github.com/user-attachments/assets/17bd5eab-42a1-40fc-b0a6-94c39e1a77df" />


**Manage Users / Manage Recruiters**
<img src="screenshots/manage-users-recruiters.png" width="750">
<img width="1262" height="860" alt="Screenshot 2026-08-12 193825" src="https://github.com/user-attachments/assets/b4547fb7-7d00-48b6-a640-b8288c5e51d7" />

---

## Author

Built solo by **Aditya Lour** as part of an internship project.
[GitHub](https://github.com/AdityaLour) · [LinkedIn](https://www.linkedin.com/in/aditya-lour-b7439430a)
