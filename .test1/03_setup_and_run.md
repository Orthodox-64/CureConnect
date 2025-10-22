## Setup and Run — CureConnect

This file provides step-by-step instructions for setting up and running CureConnect locally on Windows (PowerShell). It covers prerequisites, environment variables, installation, and common troubleshooting.

---

## Prerequisites

Before you start, ensure you have the following installed:

1. **Node.js** (v16+ recommended) and **npm** — [Download from nodejs.org](https://nodejs.org)
2. **MongoDB** — Either:
   - Local installation: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use a cloud instance (MongoDB Atlas) and get a connection string
3. **Git** — [Download from git-scm.com](https://git-scm.com)
4. **PowerShell** — default on Windows

Optional (for full features):
- **Cloudinary account** — for image/file uploads
- **Twilio account** — for SMS and IVR features
- **Stripe account** — for payment processing
- **Google AI API key** — if using Google Generative AI features

---

## Step 1: Clone the repository

Open PowerShell and navigate to your desired directory:

```powershell
cd C:\Users\PRATHAMESH\Desktop
git clone https://github.com/Prathameshk2024/CureConnect.git
cd CureConnect
```

If you already have the repo cloned, ensure you're on the correct branch:

```powershell
git branch --show-current
```

---

## Step 2: Backend setup

### 2.1 Navigate to Backend folder

```powershell
cd Backend
```

### 2.2 Install dependencies

```powershell
npm install
```

### 2.3 Create `.env` file

Create a new file named `.env` in the `Backend` folder. You can create it from PowerShell:

```powershell
New-Item -Path .env -ItemType File
```

Then open it in your editor (VS Code, Notepad, etc.) and add the following environment variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/cureconnect
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cureconnect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary Configuration (for file uploads)
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# Note: cloud_name is hardcoded in cloudinary.js as 'dcmdkvmwe' - update if needed

# Email Configuration (SMTP)
SMPT_SERVICE=gmail
SMPT_MAIL=your_email@gmail.com
SMPT_PASSWORD=your_app_specific_password

# Twilio Configuration (for SMS and IVR)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key

# Google AI (if using Google Generative AI)
GOOGLE_API_KEY=your_google_ai_api_key
```

**Important notes:**
- Replace all `your_*` placeholders with actual credentials.
- For Gmail SMTP, you need an "App Password" (not your regular Gmail password). Enable 2FA and generate one at [Google Account Security](https://myaccount.google.com/security).
- If you don't have Twilio/Stripe/Cloudinary accounts yet, you can skip those variables for now (some features will be disabled).

### 2.4 Start the backend server

For development (with auto-reload using nodemon):

```powershell
npm run dev
```

Or for production mode:

```powershell
npm start
```

You should see output like:

```
Server running on port 5001
User connected: <socket-id>
```

---

## Step 3: Frontend setup

### 3.1 Open a new PowerShell terminal

Keep the backend server running in the first terminal. Open a new terminal window.

### 3.2 Navigate to Frontend folder

```powershell
cd C:\Users\PRATHAMESH\Desktop\CureConnect\Frontend
```

### 3.3 Install dependencies

```powershell
npm install
```

### 3.4 Configure frontend environment (optional)

If your backend is running on a different host/port, or you need to set API base URLs, create a `.env` file in the `Frontend` folder:

```powershell
New-Item -Path .env -ItemType File
```

Add (if needed):

```env
VITE_API_URL=http://localhost:5001/api/v1
VITE_SOCKET_URL=http://localhost:5001
```

The frontend `axios.js` file likely already has the base URL configured, so this step is optional unless you're deploying to different environments.

### 3.5 Start the frontend dev server

```powershell
npm run dev
```

Vite will start the development server and show you the local URL (typically `http://localhost:5173`). Open that URL in your browser.

---

## Step 4: Verify the application

1. **Backend health check:**
   - Navigate to `http://localhost:5001/` in your browser. You should see a 404 JSON response: `"No such route founded in server...💣💣💣"`. This confirms the server is running.

2. **Frontend:**
   - Open `http://localhost:5173` (or the URL shown by Vite). You should see the CureConnect homepage.

3. **Test registration/login:**
   - Try registering a new user or logging in to verify the full stack is working.

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
- If using local MongoDB, ensure the MongoDB service is running:
  ```powershell
  # Check if MongoDB is running (Windows Service):
  Get-Service -Name MongoDB
  
  # If not running, start it:
  Start-Service -Name MongoDB
  ```
- If using MongoDB Atlas, double-check your connection string and ensure your IP is whitelisted in Atlas Network Access settings.

### Issue: "JWT_SECRET is missing" or authentication errors

**Solution:**
- Ensure `JWT_SECRET` is set in `Backend/.env`.
- Restart the backend server after modifying `.env`.

### Issue: "Cloudinary upload failed"

**Solution:**
- Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are correct in `.env`.
- Check if the `cloud_name` in `Backend/utils/cloudinary.js` matches your Cloudinary account. If not, update line 6:
  ```javascript
  cloud_name: 'your_cloudinary_cloud_name',
  ```

### Issue: "Port 5001 already in use"

**Solution:**
- Another process is using port 5001. Either stop that process or change the `PORT` in `Backend/.env` to a different port (e.g., `PORT=5002`).
- Find and kill the process on Windows:
  ```powershell
  # Find process using port 5001:
  netstat -ano | findstr :5001
  
  # Kill the process (replace <PID> with the actual process ID):
  taskkill /PID <PID> /F
  ```

### Issue: "CORS errors" when calling backend from frontend

**Solution:**
- Check the `cors` configuration in `Backend/server.js`. For local development, the current permissive configuration should work.
- If deploying to production, update the `origin` in the CORS middleware to match your frontend domain.

### Issue: Email or SMS not sending

**Solution:**
- **Email:** Verify `SMPT_SERVICE`, `SMPT_MAIL`, and `SMPT_PASSWORD` are correct. If using Gmail, ensure you're using an App Password (not your regular password).
- **SMS:** Verify Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`). Check your Twilio console for any errors or quota limits.

### Issue: "Module not found" errors

**Solution:**
- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  Remove-Item package-lock.json
  npm install
  ```

---

## Quick Start Scripts (PowerShell)

To make it easier to start both servers, you can create a PowerShell script. Save this as `start-dev.ps1` in the project root:

```powershell
# start-dev.ps1
# Start backend and frontend in parallel

Write-Host "Starting CureConnect development servers..." -ForegroundColor Green

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"

# Wait 3 seconds for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"

Write-Host "Servers starting in new windows. Check those windows for status." -ForegroundColor Cyan
```

Run it:

```powershell
.\start-dev.ps1
```

---

## Next Steps

- Check `04_api_endpoints.md` for a detailed list of API routes.
- Review `05_developer_notes.md` for coding conventions and how to add new features.
- See `06_release_and_git_workflow.md` for git workflow and deployment guidance.

---

## Committing this file

To commit and push only this file (PowerShell):

```powershell
git add .test1/03_setup_and_run.md
git commit -m "docs: add .test1/03_setup_and_run.md — setup and run instructions"
git push origin <your-branch-name>
```

Replace `<your-branch-name>` with your current branch (use `git branch --show-current` to check).

---

**Ready for the next file?** Say "next" to add `04_api_endpoints.md`.
