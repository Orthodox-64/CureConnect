## CureConnect — More about the app

This document summarizes the CureConnect project: purpose, architecture, core features, important services, environment variables to check, and how to commit & push a single file (PowerShell) so you can add the six `.test1` files one-by-one.

### Purpose

CureConnect is an AI-powered telemedicine platform targeted at low-bandwidth and rural environments. It combines real-time communication (video/chat), AI diagnostics (ECG/X-ray/retinopathy/PET/skin/Alzheimer models), appointment booking, IVR emergency features, medicine e-commerce, and multilingual accessibility.

### High-level architecture

- Frontend: React + Vite app in `Frontend/`. Uses Redux, React Router, MUI and Tailwind for UI. Contains AI-assist components, image/video upload components, and pages for appointments/prescriptions.
- Backend: Express server in `Backend/` (entry `server.js`) with MongoDB (mongoose) as the primary data store.
- Real-time: Socket.IO handles WebRTC signaling for video calls and a separate namespace for chat (`/chat`).
- AI & Analysis: Uses pretrained ML models / APIs for image/video analysis. The codebase references Google Generative AI libraries and local analysis routes under `Backend/routes/analysisRoutes`.
- Third-party services: Cloudinary (file storage), Stripe (payments), Twilio (SMS/IVR), ZegoCloud (video), and various Google AI packages.

### Core features (quick)

- Adaptive video calling optimized for low bandwidth (WebRTC signaling via Socket.IO).
- Offline-capable chat using WebSockets/socket.io.
- Appointment booking with reminders (server schedules reminders on startup using `utils/sendReminder`).
- AI-powered analysis modules for medical imaging and ECG data.
- Prescription generation (PDF via `pdfkit`) and pharmacy/e-commerce integration.
- IVR emergency routing and hospital locator.

### Important backend files and locations

- `Backend/server.js` — main server, socket handlers, routes registration, error middleware.
- `Backend/models/` — Mongoose models (users, appointments, prescriptions, medicines, orders, pharmacies).
- `Backend/routes/` — Express routes (user, appointment, pharmacy, analysis, admin).
- `Backend/controller/` — Controller implementations for route logic.
- `Backend/utils/` — helpers such as `cloudinary.js`, `jwtToken.js`, `sendEmail.js`, `sendSMS.js`, and `sendReminder.js`.

### Key environment variables (check `Backend/.env` or create one)

The project references several environment variables. Confirm/set at least the following in your `.env` before starting the backend:

- MONGODB_URI — MongoDB connection string
- PORT — (optional) backend port, default 5001
- NODE_ENV — `development` or `production`
- JWT_SECRET — JSON Web Token secret used for authentication
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — Cloudinary credentials for uploads
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER — for SMS/IVR functionality
- STRIPE_SECRET_KEY — for payments
- EMAIL_USER, EMAIL_PASS — SMTP credentials used by `nodemailer`
- GOOGLE_API_KEY or other Google credentials — if using Google Generative AI or other Google services

If you need precise names, inspect `Backend/utils/*.js` files for exact env keys used by helpers.

### How to run (local, quick)

1. Backend
   - Open a PowerShell terminal.
   - cd into `Backend` and install dependencies: `npm install`.
   - Create a `.env` file with the variables listed above.
   - Start the server in dev: `npm run dev` (requires `nodemon`) or `npm start`.

2. Frontend
   - Open a separate terminal, cd into `Frontend` and run `npm install`.
   - Start dev server: `npm run dev` (Vite). Default dev URL will be shown by Vite.

### What I looked at to prepare this doc

- Top-level `README.md` — features and product positioning.
- `Backend/server.js`, `Backend/package.json` — server runtime dependencies and key runtime behaviors (sockets, reminders, routes).
- `Frontend/package.json` — frontend stack and notable libs.

---

## Committing and pushing one file at a time (PowerShell commands)

Follow these steps to add and push only the first file (`.test1/01_more_about_app.md`) to the current branch (here assumed `branch1`). These commands are for PowerShell.

1. Check current branch (optional):

   git branch --show-current

2. Stage only the new file:

   git add .test1/01_more_about_app.md

3. Commit with a clear message:

   git commit -m "docs: add .test1/01_more_about_app.md — project overview"

4. Push to the remote branch (if your branch is `branch1` and already tracks origin/branch1):

   git push origin branch1

   If the local branch isn't set to track a remote yet, run:

   git push --set-upstream origin branch1

Notes:
- Repeat the same pattern for each of the next five files; stage only the specific file you want to push each time.
- If you prefer a single-file commit on an already-committed branch, the `--no-verify` flag can be used in extreme cases to bypass hooks, but use with caution.

---

I'll wait for your confirmation (`next`) before I create the second file (`02_architecture_overview.md`).

Small verification checklist I ran mentally while creating this file:

- Verified core dependencies in `Backend/package.json` and `Frontend/package.json` to list third-party services.
- Scanned `server.js` to confirm sockets, reminders, and routes.

If you'd like, I can also commit & push this file for you now (I'll run the git commands in a PowerShell terminal). Tell me if you want me to run the push now or if you'll push locally.
