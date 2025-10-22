## Architecture overview — CureConnect

This file describes the system architecture for CureConnect: components, data flow, real-time subsystems, storage, and external integrations. It is written from the codebase (Backend server, routes, and Frontend package) and is intended to be accurate for developers onboarding to the project.

### Components

- Frontend (React + Vite)
  - Location: `Frontend/`
  - Responsibilities: UI, authentication flows, appointment booking UI, file upload components (images/videos), AI assist modals, and payment flows.
  - Libraries: React, Redux, React Router, MUI, Tailwind, socket.io-client, Stripe, Cloudinary React.

- Backend (Express + Node)
  - Location: `Backend/` (entry points: `index.js` and `server.js`)
  - Responsibilities: REST API, authentication/authorization, prescription generation, appointment scheduling, pharmacy and order management, file uploads (Cloudinary), and integrating third-party services (Stripe, Twilio).
  - Key files: `server.js`, `routes/`, `controller/`, `models/`, `utils/`.

- Database
  - MongoDB via Mongoose models in `Backend/models/`.
  - Stores users, doctors, appointments, prescriptions, pharmacies, medicines, and orders.

- Real-time & Media
  - Socket.IO server in `server.js` handles:
    - WebRTC signaling for video calls (rooms, offer/answer, ICE candidates).
    - A `doctorSockets` map for doctor emergency notifications.
    - A `/chat` namespace for lightweight chat rooms and messages.
  - Video/audio media flows are peer-to-peer via WebRTC; Socket.IO is used only for signaling and message exchange.

- AI / Analysis
  - Analysis routes (e.g., `Backend/routes/analysisRoutes.js`) provide an endpoint `/api/v1/analyze` to accept media and return analysis. The route currently returns a mock response but is the hook for integrating ML models or cloud ML APIs.

- External services
  - Cloudinary — media storage and transformations (util under `Backend/utils/cloudinary.js`).
  - Twilio — SMS and IVR (utils/sendSMS.js). Emergency IVR and routing integrate with Twilio credentials in env.
  - Stripe — payments for appointment or pharmacy orders.
  - Google GenAI packages — referenced in `package.json` for possible AI text/image features.

### Data flows (simplified)

1. User registers / logs in (Frontend -> POST `/api/v1/register` or `/api/v1/login`). Server returns JWT cookie/token.
2. User requests appointment (Frontend -> POST `/api/v1/appointment/new`). Server stores appointment, schedules reminders via `utils/sendReminder` and server startup scheduler.
3. Real-time call setup:
   - Client A creates a room and signals `join-room` via Socket.IO.
   - When two peers are present, server emits `ready`, and clients exchange `offer`/`answer` and `ice-candidate` events.
   - Media goes P2P via WebRTC.
4. File uploads (images, prescriptions, medicine photos): Frontend uploads file(s) to backend endpoints that use Cloudinary helper functions to store files.
5. Pharmacy flow: Pharmacies register, pharmacists add medicines, users create orders via `/api/v1/orders` and pharmacists manage orders via `/api/v1/pharmacy/orders`.

### Important routes (selection)

- User & Auth: `/api/v1/register`, `/api/v1/login`, `/api/v1/logout`, `/api/v1/me`, `/api/v1/doctors`
- Appointment: `/api/v1/appointment/new`, `/api/v1/appointment/my`, `/api/v1/appointment/slots/:doctorId/:date`, `/api/v1/appointment/:id`
- Pharmacy & Medicines: `/api/v1/pharmacy/*`, `/api/v1/medicines`, `/api/v1/medicine/:id`, `/api/v1/orders` and related order endpoints
- Analysis: `/api/v1/analyze` (media analysis)
- Prescription: `/api/v1/prescription/*` (create, list, get, generate PDF)

### Deployment considerations

- Environment variables required for production should be stored securely (Managed env secrets in the host). Use `NODE_ENV=production` to disable verbose error logs.
- Ensure the server's Socket.IO CORS is correctly configured for production origin(s) instead of the permissive debug configuration in `server.js`.
- For scaling WebRTC, ensure sticky sessions or use a signaling service; media remains P2P but session management may require scaling considerations.

### Simple ASCII diagram

Frontend (React)
   | (HTTPS REST / WS)
   v
Backend Express + Socket.IO -----> MongoDB
   |             |
   |             +--> Cloudinary
   +--> Twilio, Stripe, Google AI

---

I'll mark task 2 completed and set task 3 in-progress in the todo list. Say "next" when you're ready for the setup/run doc (`03_setup_and_run.md`).
