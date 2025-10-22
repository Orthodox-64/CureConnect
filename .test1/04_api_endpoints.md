## API Endpoints Reference — CureConnect

This document lists all major API endpoints in the CureConnect backend, organized by domain. For each endpoint, you'll find the HTTP method, route, authentication requirements, request body/parameters, and a brief description.

**Base URL:** `http://localhost:5001/api/v1` (or your configured backend URL)

---

## Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Appointments](#2-appointments)
3. [Prescriptions](#3-prescriptions)
4. [Pharmacy Management](#4-pharmacy-management)
5. [Medicine Catalog](#5-medicine-catalog)
6. [Orders](#6-orders)
7. [Analysis (AI/ML)](#7-analysis-aiml)
8. [Medical History](#8-medical-history)

---

## 1. Authentication & User Management

### POST `/register`
- **Description:** Register a new user (patient, doctor, or pharmacist)
- **Auth:** None (public)
- **Body:**
  ```json
  {
    "name": "string",
    "contact": "email or phone",
    "password": "string",
    "role": "patient | doctor | pharmacist",
    "speciality": "string (required for doctors)",
    "avatar": "file or JSON (optional for doctors)"
  }
  ```
- **Response:** JWT token in cookie + user object
- **Notes:** 
  - For doctors, upload an avatar using multipart/form-data
  - Sends welcome email/SMS based on contact type

### POST `/login`
- **Description:** Login with contact and password
- **Auth:** None (public)
- **Body:**
  ```json
  {
    "contact": "email or phone",
    "password": "string"
  }
  ```
- **Response:** JWT token in cookie + user object

### GET `/logout`
- **Description:** Logout current user
- **Auth:** Required (any role)
- **Response:** Success message

### GET `/me`
- **Description:** Get current logged-in user details
- **Auth:** Required (any role)
- **Response:** User object

### GET `/doctors`
- **Description:** Get all registered doctors
- **Auth:** None (public)
- **Response:** Array of doctor objects (excluding passwords)

### GET `/patient/:patientId/complete-data`
- **Description:** Get complete patient data (profile + medical history + appointments)
- **Auth:** Required (authenticated user)
- **URL Params:** `patientId` - Patient's user ID
- **Response:** Complete patient data object

---

## 2. Appointments

### POST `/appointment/new`
- **Description:** Create a new appointment with a doctor
- **Auth:** Required (any authenticated user)
- **Body:**
  ```json
  {
    "doctor": "doctorId (ObjectId)",
    "description": "string",
    "symptoms": "string",
    "day": "YYYY-MM-DD",
    "time": "HH:MM"
  }
  ```
- **Response:** Created appointment with auto-generated roomId for video call
- **Notes:** 
  - Checks for time slot conflicts
  - Sends email/SMS to both patient and doctor with room link
  - Schedules automatic reminders

### GET `/appointment/my`
- **Description:** Get all appointments for current user (as patient or doctor)
- **Auth:** Required (any role)
- **Response:** Array of appointments (populated with patient/doctor details)

### GET `/appointment/slots/:doctorId/:date`
- **Description:** Get available time slots for a specific doctor on a date
- **Auth:** None (public)
- **URL Params:** 
  - `doctorId` - Doctor's user ID
  - `date` - Date in YYYY-MM-DD format
- **Response:** Array of available time slots

### GET `/appointment/:id`
- **Description:** Get single appointment details
- **Auth:** Required (must be patient or doctor in the appointment)
- **URL Params:** `id` - Appointment ID
- **Response:** Appointment object with populated patient/doctor

### DELETE `/appointment/:id`
- **Description:** Delete/cancel an appointment
- **Auth:** Required (must be patient or doctor in the appointment)
- **URL Params:** `id` - Appointment ID
- **Response:** Success message

---

## 3. Prescriptions

### POST `/prescription/new`
- **Description:** Create a new prescription (doctor only)
- **Auth:** Required (role: doctor)
- **Body:**
  ```json
  {
    "patientId": "ObjectId",
    "appointmentId": "ObjectId",
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "duration": "string"
      }
    ],
    "diagnosis": "string",
    "symptoms": "string (optional)",
    "notes": "string (optional)",
    "followUpInstructions": "string (optional)"
  }
  ```
- **Response:** Created prescription with auto-generated prescription number
- **Notes:** Generates unique prescription number like `RX1729603245ABC12`

### GET `/prescriptions`
- **Description:** Get all prescriptions (filtered by user role)
- **Auth:** Required (any role)
- **Response:** 
  - For doctors: prescriptions they've written
  - For patients: prescriptions they've received
- **Notes:** Sorted by creation date (newest first)

### GET `/prescription/:id`
- **Description:** Get single prescription details
- **Auth:** Required (must be patient or doctor in the prescription)
- **URL Params:** `id` - Prescription ID
- **Response:** Prescription object with populated patient/doctor/appointment

### GET `/prescription/:id/pdf`
- **Description:** Generate and download PDF version of prescription
- **Auth:** Required (must be patient or doctor in the prescription)
- **URL Params:** `id` - Prescription ID
- **Response:** PDF file stream
- **Notes:** Uses PDFKit to generate formatted prescription document

---

## 4. Pharmacy Management

### POST `/pharmacy/register`
- **Description:** Register a new pharmacy (converts user to pharmacist role)
- **Auth:** Required (any role, will be upgraded to pharmacist)
- **Body:** (multipart/form-data or JSON)
  ```json
  {
    "name": "string",
    "description": "string",
    "licenseNumber": "string (unique)",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "pincode": "string"
    },
    "contactInfo": {
      "phone": "string",
      "email": "string",
      "whatsapp": "string (optional)"
    },
    "operatingHours": {
      "weekdays": { "open": "HH:MM", "close": "HH:MM" },
      "weekends": { "open": "HH:MM", "close": "HH:MM" }
    },
    "establishedYear": "number (optional)",
    "deliveryRadius": "number in km (optional)",
    "avatar": "file (optional)"
  }
  ```
- **Response:** Created pharmacy object
- **Notes:** Checks for duplicate license numbers

### GET `/pharmacy/my`
- **Description:** Get current user's pharmacy
- **Auth:** Required (role: pharmacist)
- **Response:** Pharmacy object

### PUT `/pharmacy/my`
- **Description:** Update pharmacy details
- **Auth:** Required (role: pharmacist)
- **Body:** Same fields as register (partial updates allowed)
- **Response:** Updated pharmacy object

### GET `/pharmacies`
- **Description:** Get all pharmacies (with optional filters)
- **Auth:** None (public)
- **Query Params:** 
  - `city` - Filter by city
  - `pincode` - Filter by pincode
  - `page` - Pagination page number
  - `limit` - Results per page
- **Response:** Array of pharmacy objects

### GET `/pharmacy/:id`
- **Description:** Get specific pharmacy details
- **Auth:** None (public)
- **URL Params:** `id` - Pharmacy ID
- **Response:** Pharmacy object

### GET `/pharmacy/stats`
- **Description:** Get pharmacy statistics (total medicines, orders, revenue, etc.)
- **Auth:** Required (role: pharmacist)
- **Response:** Statistics object

### POST `/pharmacy/medicines`
- **Description:** Add new medicine to pharmacy inventory
- **Auth:** Required (role: pharmacist)
- **Body:**
  ```json
  {
    "name": "string",
    "genericName": "string",
    "manufacturer": "string",
    "category": "string",
    "price": "number",
    "discount": "number (0-100)",
    "stock": "number",
    "description": "string",
    "expiryDate": "YYYY-MM-DD",
    "images": ["file1", "file2"] (multipart)
  }
  ```
- **Response:** Created medicine object

### PUT `/pharmacy/medicine/:id`
- **Description:** Update medicine details
- **Auth:** Required (role: pharmacist)
- **URL Params:** `id` - Medicine ID
- **Body:** Same as add medicine (partial updates allowed)
- **Response:** Updated medicine object

### DELETE `/pharmacy/medicine/:id`
- **Description:** Delete medicine from inventory
- **Auth:** Required (role: pharmacist)
- **URL Params:** `id` - Medicine ID
- **Response:** Success message

### GET `/pharmacy/:pharmacyId/medicines`
- **Description:** Get all medicines for a specific pharmacy
- **Auth:** None (public)
- **URL Params:** `pharmacyId` - Pharmacy ID
- **Response:** Array of medicine objects

### GET `/pharmacy/medicines/low-stock`
- **Description:** Get medicines with low stock (< 10 units)
- **Auth:** Required (role: pharmacist)
- **Response:** Array of low-stock medicines

### GET `/pharmacy/medicines/expiring`
- **Description:** Get medicines expiring soon (within 3 months)
- **Auth:** Required (role: pharmacist)
- **Response:** Array of expiring medicines

---

## 5. Medicine Catalog

### GET `/medicines`
- **Description:** Get all available medicines across all pharmacies
- **Auth:** None (public)
- **Query Params:**
  - `keyword` - Search by name
  - `category` - Filter by category
  - `page`, `limit` - Pagination
- **Response:** Array of medicine objects

### GET `/medicines/search`
- **Description:** Search medicines by name or generic name
- **Auth:** None (public)
- **Query Params:** `q` - Search query
- **Response:** Array of matching medicines

### GET `/medicines/categories`
- **Description:** Get all medicine categories
- **Auth:** None (public)
- **Response:** Array of unique category names

### GET `/medicines/featured`
- **Description:** Get featured/popular medicines
- **Auth:** None (public)
- **Response:** Array of featured medicines

### GET `/medicine/:id`
- **Description:** Get single medicine details
- **Auth:** None (public)
- **URL Params:** `id` - Medicine ID
- **Response:** Medicine object with pharmacy details

---

## 6. Orders

### POST `/orders`
- **Description:** Create a new medicine order
- **Auth:** Required (any role)
- **Body:**
  ```json
  {
    "pharmacy": "pharmacyId",
    "items": [
      {
        "medicine": "medicineId",
        "quantity": "number",
        "price": "number"
      }
    ],
    "shippingAddress": {
      "street": "string",
      "city": "string",
      "state": "string",
      "pincode": "string",
      "phone": "string"
    },
    "paymentMethod": "COD | Online",
    "prescriptionImages": ["file1", "file2"] (optional, multipart)
  }
  ```
- **Response:** Created order object
- **Notes:** Automatically calculates total and checks stock availability

### GET `/orders/my`
- **Description:** Get all orders for current user
- **Auth:** Required (any role)
- **Response:** Array of order objects with medicine/pharmacy details

### GET `/pharmacy/orders`
- **Description:** Get all orders for pharmacist's pharmacy
- **Auth:** Required (role: pharmacist)
- **Response:** Array of orders with customer details

### GET `/order/:id`
- **Description:** Get single order details
- **Auth:** Required (must be customer or pharmacist)
- **URL Params:** `id` - Order ID
- **Response:** Order object with full details

### PUT `/order/:id/status`
- **Description:** Update order status (pharmacist only)
- **Auth:** Required (role: pharmacist)
- **URL Params:** `id` - Order ID
- **Body:**
  ```json
  {
    "status": "Pending | Processing | Shipped | Delivered | Cancelled"
  }
  ```
- **Response:** Updated order object

### PUT `/order/:id/cancel`
- **Description:** Cancel an order (customer only, before processing)
- **Auth:** Required (must be order customer)
- **URL Params:** `id` - Order ID
- **Response:** Cancelled order object

### PUT `/order/:id/rate`
- **Description:** Rate and review an order
- **Auth:** Required (must be order customer)
- **URL Params:** `id` - Order ID
- **Body:**
  ```json
  {
    "rating": "number (1-5)",
    "review": "string (optional)"
  }
  ```
- **Response:** Updated order with rating

---

## 7. Analysis (AI/ML)

### POST `/analyze`
- **Description:** Analyze medical images/videos using AI models
- **Auth:** None (public) - consider adding auth in production
- **Body:**
  ```json
  {
    "video_url": "string (Cloudinary URL or base64)",
    "prompt": "string (analysis type/instructions)"
  }
  ```
- **Response:** 
  ```json
  {
    "success": true,
    "analysis": "string (AI-generated analysis)"
  }
  ```
- **Notes:** 
  - Currently returns mock response
  - Intended for ECG, X-ray, retinopathy, PET, skin, Alzheimer analysis
  - Integrate actual ML models or cloud ML APIs here

---

## 8. Medical History

### POST `/medical-history`
- **Description:** Add medical history entry for current user
- **Auth:** Required (any role)
- **Body:**
  ```json
  {
    "condition": "string",
    "diagnosisDate": "YYYY-MM-DD",
    "treatment": "string (optional)",
    "notes": "string (optional)"
  }
  ```
- **Response:** Success message

### GET `/medical-history/:userId`
- **Description:** Get medical history for a user
- **Auth:** Required (user must be patient or their doctor)
- **URL Params:** `userId` - User ID
- **Response:** Array of medical history entries

---

## Authentication & Authorization Notes

- **JWT Token:** Stored in HTTP-only cookie named `token`
- **Token Expiry:** 7 days (configurable via `JWT_EXPIRE` env var)
- **Middleware:** 
  - `isAuthenticatedUser` - Verifies JWT token
  - `authorizeRoles(role1, role2, ...)` - Checks user role
- **Protected Routes:** Most routes require authentication; public routes are explicitly noted above

---

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting & Security

- **CORS:** Currently permissive for development; restrict in production
- **File Uploads:** Limited to 5MB per file (Cloudinary)
- **Rate Limiting:** Not implemented; consider adding for production
- **Input Validation:** Uses `validator` package for email/phone validation

---

## WebSocket Events (Socket.IO)

In addition to REST endpoints, the server provides real-time features via Socket.IO:

### Video Call Namespace (default)
- `join-room(roomId)` - Join a video call room
- `offer({ roomId, offer })` - Send WebRTC offer
- `answer({ roomId, answer })` - Send WebRTC answer
- `ice-candidate({ roomId, candidate })` - Exchange ICE candidates
- `ready` - Emitted when both peers are in room
- `room-full` - Emitted when room capacity reached

### Chat Namespace (`/chat`)
- `join-room(roomId)` - Join a chat room
- `user-message({ roomId, text })` - Send a message
- `message({ text, sender })` - Receive a message

### Emergency Notifications
- `doctorConnect(doctorId)` - Register doctor for emergency alerts
- `emergencyRequest(patientData)` - Trigger emergency notification to all doctors

---

## Testing with cURL (PowerShell)

Example: Register a new patient

```powershell
$body = @{
    name = "John Doe"
    contact = "john@example.com"
    password = "securepass123"
    role = "patient"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5001/api/v1/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -SessionVariable session
```

Example: Get all doctors

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/v1/doctors" -Method GET
```

---

## Committing this file

To commit and push only this file (PowerShell):

```powershell
git add .test1/04_api_endpoints.md
git commit -m "docs: add .test1/04_api_endpoints.md — API reference"
git push origin <your-branch-name>
```

Replace `<your-branch-name>` with your current branch.

---

**Ready for the next file?** Say "next" to add `05_developer_notes.md`.
