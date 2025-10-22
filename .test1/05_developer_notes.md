## Developer Notes — CureConnect

This document provides developer-focused guidance for contributing to CureConnect. It covers coding conventions, project structure, common patterns, how to add new features, and testing strategies.

---

## Table of Contents

1. [Coding Conventions](#1-coding-conventions)
2. [Project Structure Deep Dive](#2-project-structure-deep-dive)
3. [Common Patterns & Best Practices](#3-common-patterns--best-practices)
4. [How to Add New Features](#4-how-to-add-new-features)
5. [Testing Guidelines](#5-testing-guidelines)
6. [Debugging Tips](#6-debugging-tips)
7. [Performance Considerations](#7-performance-considerations)
8. [Security Best Practices](#8-security-best-practices)

---

## 1. Coding Conventions

### Backend (Node.js/Express)

**File Naming:**
- Controllers: `camelCaseController.js` (e.g., `userController.js`)
- Models: `camelCaseModel.js` (e.g., `userModel.js`)
- Routes: `camelCaseRoutes.js` (e.g., `userRoute.js`, `appointmentRoutes.js`)
- Utils: `camelCase.js` (e.g., `jwtToken.js`, `sendEmail.js`)
- Middleware: `camelCase.js` (e.g., `auth.js`, `catchAsyncError.js`)

**Function Naming:**
- Controller functions: `camelCase` with descriptive verbs (e.g., `registerUser`, `getAllDoctors`, `newAppointment`)
- Middleware: `camelCase` (e.g., `isAuthenticatedUser`, `authorizeRoles`)
- Utilities: `camelCase` (e.g., `sendToken`, `sendEmail`)

**Code Style:**
- Use `const` for immutable variables, `let` for mutable
- Prefer async/await over promises with `.then()`
- Always wrap controller logic with `catchAsyncError` middleware
- Use descriptive variable names (e.g., `appointmentDateTime` instead of `dt`)
- Add comments for complex business logic

**Error Handling:**
- Always use the custom `ErrorHander` class (note: it's spelled "Hander" not "Handler" in the codebase)
- Include meaningful error messages
- Set appropriate HTTP status codes:
  - 400 for validation errors
  - 401 for unauthorized
  - 403 for forbidden
  - 404 for not found
  - 500 for server errors

Example:
```javascript
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.myController = catchAsyncError(async (req, res, next) => {
    const { requiredField } = req.body;
    
    if (!requiredField) {
        return next(new ErrorHander("Required field is missing", 400));
    }
    
    // Business logic...
    
    res.status(200).json({
        success: true,
        data: result
    });
});
```

### Frontend (React)

**File Naming:**
- Components: `PascalCase.jsx` (e.g., `DoctorCard.jsx`, `LoadingSpinner.jsx`)
- Pages: `PascalCase.jsx` (e.g., `Dashboard.jsx`, `Appointments.jsx`)
- Actions: `camelCaseActions.js` (e.g., `userActions.js`)
- Reducers: `camelCaseReducer.js` (e.g., `userReducer.js`)
- Utils: `camelCase.js` (e.g., `axios.js`)

**Component Structure:**
- Use functional components with hooks
- Import order: React hooks → third-party libraries → components → utils/actions → styles
- Export components as default at the end of file

Example:
```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import MyComponent from '../components/MyComponent';
import { myAction } from '../actions/myActions';
import './MyPage.css';

const MyPage = () => {
    const [state, setState] = useState(initialValue);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Side effects
    }, []);
    
    return (
        <div>
            {/* JSX */}
        </div>
    );
};

export default MyPage;
```

**State Management:**
- Use Redux for global state (user, appointments, prescriptions)
- Use local `useState` for component-specific state
- Use `useEffect` for side effects and data fetching

**Styling:**
- Mix of Tailwind CSS classes and custom CSS
- Component-specific styles in separate `.css` files
- Use Material-UI components where applicable

---

## 2. Project Structure Deep Dive

### Backend Structure

```
Backend/
├── controller/          # Business logic for routes
│   ├── userController.js
│   ├── appointmentController.js
│   ├── prescriptionController.js
│   ├── pharmacyController.js
│   ├── medicineController.js
│   └── orderController.js
├── middleware/          # Express middleware
│   ├── auth.js          # JWT verification, role authorization
│   └── catchAsyncError.js  # Async error wrapper
├── models/              # Mongoose schemas
│   ├── userModel.js
│   ├── appointmentModel.js
│   ├── prescriptionModel.js
│   ├── pharmacyModel.js
│   ├── medicineModel.js
│   └── orderModel.js
├── routes/              # Express route definitions
│   ├── userRoute.js
│   ├── appointmentRoutes.js
│   ├── pharmacyRoutes.js
│   └── analysisRoutes.js
├── utils/               # Helper functions
│   ├── cloudinary.js    # File upload configuration
│   ├── errorHander.js   # Custom error class
│   ├── jwtToken.js      # JWT token generation
│   ├── sendEmail.js     # Email sending via Nodemailer
│   ├── sendSMS.js       # SMS via Twilio
│   └── sendReminder.js  # Appointment reminders
├── server.js            # Main server file (Socket.IO, routes, error handling)
├── index.js             # Alternative entry point
└── package.json         # Dependencies
```

### Frontend Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── actions/         # Redux actions
│   │   ├── userActions.js
│   │   ├── appointmentActions.js
│   │   ├── prescriptionActions.js
│   │   └── pharmacyActions.js
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── DoctorCard.jsx
│   │   ├── AppointmentCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ...
│   ├── pages/           # Route-level components
│   │   ├── Dashboard.jsx
│   │   ├── Appointments.jsx
│   │   ├── Prescriptions.jsx
│   │   └── ...
│   ├── reducers/        # Redux reducers
│   │   ├── userReducer.js
│   │   ├── appointmentReducer.js
│   │   └── ...
│   ├── constants/       # Action type constants
│   ├── utils/           # Helper functions
│   ├── locales/         # i18n translations
│   ├── styles/          # Global styles
│   ├── store.js         # Redux store configuration
│   ├── axios.js         # Axios configuration
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
└── package.json         # Dependencies
```

---

## 3. Common Patterns & Best Practices

### Backend Patterns

**1. Error Handling Pattern**

Every controller function should be wrapped with `catchAsyncError`:

```javascript
exports.myFunction = catchAsyncError(async (req, res, next) => {
    // Logic here
    // If error occurs, use: return next(new ErrorHander("Message", statusCode));
});
```

**2. Authentication Pattern**

Routes requiring authentication:

```javascript
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/protected')
    .get(isAuthenticatedUser, myController);

router.route('/admin-only')
    .get(isAuthenticatedUser, authorizeRoles("admin"), adminController);
```

**3. Model Schema Pattern**

Use Mongoose schema with validators:

```javascript
const mySchema = new mongoose.Schema({
    field: {
        type: String,
        required: [true, "Error message"],
        validate: {
            validator: function(v) {
                return /some-regex/.test(v);
            },
            message: "Validation error message"
        }
    }
});

// Pre-save hooks
mySchema.pre("save", async function (next) {
    // Logic before saving (e.g., password hashing)
    next();
});

// Instance methods
mySchema.methods.myMethod = function () {
    // Custom method logic
};
```

**4. JWT Token Pattern**

From `userModel.js`:

```javascript
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h'
    });
};
```

Use in controller via `sendToken` utility:

```javascript
const sendToken = require("../utils/jwtToken");
sendToken(user, 201, res); // Sets cookie and sends response
```

**5. File Upload Pattern**

Use Cloudinary middleware from `utils/cloudinary.js`:

```javascript
const { uploadSingle, uploadMultiple } = require('../utils/cloudinary');

// Single file
router.post('/upload', uploadSingle, controller);
// req.file will contain { filename, path, public_id, secure_url }

// Multiple files
router.post('/upload-many', uploadMultiple, controller);
// req.files will be an array
```

### Frontend Patterns

**1. Redux Action Pattern**

```javascript
// actions/myActions.js
export const myAction = (data) => async (dispatch) => {
    try {
        dispatch({ type: MY_REQUEST });
        
        const config = { headers: { "Content-Type": "application/json" } };
        const { data: responseData } = await axios.post("/api/v1/endpoint", data, config);
        
        dispatch({ type: MY_SUCCESS, payload: responseData });
    } catch (error) {
        dispatch({ 
            type: MY_FAIL, 
            payload: error.response?.data?.message || error.message 
        });
    }
};
```

**2. Redux Reducer Pattern**

```javascript
// reducers/myReducer.js
export const myReducer = (state = initialState, action) => {
    switch (action.type) {
        case MY_REQUEST:
            return { ...state, loading: true };
        case MY_SUCCESS:
            return { loading: false, data: action.payload };
        case MY_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};
```

**3. Toast Notification Pattern**

```javascript
import { toast } from 'react-toastify';

// Success
toast.success("Operation successful!");

// Error
toast.error(error?.message || "Something went wrong");

// Info
toast.info("Please wait...");
```

**4. Protected Route Pattern**

Check user authentication before rendering:

```javascript
const MyProtectedPage = () => {
    const { user, isAuthenticated } = useSelector(state => state.user);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    
    return <div>Protected content</div>;
};
```

---

## 4. How to Add New Features

### Example: Adding a "Reviews" Feature

#### Step 1: Create the Model (`Backend/models/reviewModel.js`)

```javascript
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, "Please provide a rating"],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, "Please provide a comment"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
```

#### Step 2: Create the Controller (`Backend/controller/reviewController.js`)

```javascript
const ErrorHander = require("../utils/errorHander");
const Review = require("../models/reviewModel");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.createReview = catchAsyncError(async (req, res, next) => {
    const { doctor, rating, comment } = req.body;
    
    if (!doctor || !rating || !comment) {
        return next(new ErrorHander("All fields are required", 400));
    }
    
    const review = await Review.create({
        user: req.user._id,
        doctor,
        rating,
        comment
    });
    
    res.status(201).json({
        success: true,
        review
    });
});

exports.getDoctorReviews = catchAsyncError(async (req, res, next) => {
    const reviews = await Review.find({ doctor: req.params.doctorId })
        .populate('user', 'name avatar');
    
    res.status(200).json({
        success: true,
        reviews
    });
});
```

#### Step 3: Create Routes (`Backend/routes/reviewRoutes.js`)

```javascript
const express = require('express');
const { createReview, getDoctorReviews } = require('../controller/reviewController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.route('/review/new').post(isAuthenticatedUser, createReview);
router.route('/reviews/:doctorId').get(getDoctorReviews);

module.exports = router;
```

#### Step 4: Register Routes in `server.js`

```javascript
// Add after existing routes
const review = require('./routes/reviewRoutes');
app.use('/api/v1', review);
```

#### Step 5: Create Frontend Action (`Frontend/src/actions/reviewActions.js`)

```javascript
import axios from '../axios';
import {
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL
} from '../constants/reviewConstants';

export const createReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_REVIEW_REQUEST });
        
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post("/api/v1/review/new", reviewData, config);
        
        dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: CREATE_REVIEW_FAIL, 
            payload: error.response?.data?.message 
        });
    }
};
```

#### Step 6: Create Component (`Frontend/src/components/ReviewForm.jsx`)

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../actions/reviewActions';
import { toast } from 'react-toastify';

const ReviewForm = ({ doctorId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createReview({ doctor: doctorId, rating, comment }));
        toast.success("Review submitted!");
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
};

export default ReviewForm;
```

---

## 5. Testing Guidelines

### Manual Testing Checklist

**Backend:**
1. Test each new endpoint with Postman or cURL
2. Verify authentication (try without token, with invalid token, with valid token)
3. Test all error cases (missing fields, invalid data, etc.)
4. Check database updates (MongoDB Compass or shell)
5. Verify email/SMS sending (check logs)

**Frontend:**
1. Test UI responsiveness on different screen sizes
2. Check all form validations
3. Test error states (network errors, server errors)
4. Verify navigation and routing
5. Test with different user roles (patient, doctor, pharmacist)

### Unit Testing (Future Enhancement)

The project doesn't currently have automated tests. To add:

**Backend:**
- Use Jest + Supertest
- Test controllers, models, and utilities
- Mock database and external services

**Frontend:**
- Use Vitest + React Testing Library (already in package.json)
- Test components, actions, reducers
- Mock API calls with MSW (Mock Service Worker)

---

## 6. Debugging Tips

### Backend Debugging

**Enable Debug Logs:**
The codebase has extensive `console.log` statements (especially in `auth.js`). Keep them for development, remove for production.

**Common Issues:**
- JWT errors: Check `JWT_SECRET` in `.env`
- MongoDB connection errors: Verify `MONGODB_URI` and MongoDB service status
- CORS errors: Check origin in `server.js` CORS config
- File upload errors: Verify Cloudinary credentials

**Debugging Tools:**
```powershell
# Check MongoDB connection
mongosh "your-connection-string"

# View server logs in real-time
npm run dev

# Test API endpoint
Invoke-RestMethod -Uri "http://localhost:5001/api/v1/endpoint" -Method GET
```

### Frontend Debugging

**Redux DevTools:**
Install Redux DevTools extension in Chrome/Edge. The project uses `@redux-devtools/extension`.

**Common Issues:**
- Blank page: Check browser console for errors
- API not connecting: Verify backend is running, check `axios.js` base URL
- State not updating: Check Redux actions and reducers

**React Developer Tools:**
Install React DevTools extension to inspect component tree and props.

---

## 7. Performance Considerations

### Backend

1. **Database Queries:**
   - Use `.select()` to limit returned fields
   - Use `.populate()` sparingly (only when needed)
   - Add indexes to frequently queried fields

2. **Socket.IO:**
   - Current implementation stores rooms in memory; consider Redis for scaling
   - Limit room sizes (currently 2 peers for video calls)

3. **File Uploads:**
   - Already limited to 5MB per file
   - Consider image compression before upload

### Frontend

1. **Code Splitting:**
   - Use React.lazy() and Suspense for route-based code splitting
   - Example:
     ```jsx
     const Dashboard = React.lazy(() => import('./pages/Dashboard'));
     ```

2. **Memoization:**
   - Use React.memo for expensive components
   - Use useMemo/useCallback for expensive computations

3. **Image Optimization:**
   - Use Cloudinary transformations for responsive images
   - Lazy load images below the fold

---

## 8. Security Best Practices

### Current Security Measures

✅ **Implemented:**
- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt (10 rounds)
- CORS configuration
- Input validation (validator package)
- Role-based authorization

⚠️ **Needs Attention:**
- Rate limiting (not implemented)
- Input sanitization (prevent XSS)
- CSRF protection
- Security headers (use Helmet.js)
- Environment variable validation

### Security Checklist for Production

1. **Environment Variables:**
   - Never commit `.env` to Git
   - Use strong `JWT_SECRET` (32+ characters)
   - Rotate secrets periodically

2. **CORS:**
   - Update `server.js` to whitelist only production frontend URL
   - Remove `callback(null, true)` permissive config

3. **HTTPS:**
   - Enforce HTTPS in production
   - Set `secure: true` in cookie options (already done)

4. **Dependencies:**
   - Regularly update packages: `npm audit fix`
   - Check for vulnerabilities: `npm audit`

5. **File Uploads:**
   - Validate file types on server-side
   - Scan for malware (consider ClamAV integration)

---

## Quick Reference Commands

### Backend
```powershell
# Install dependencies
npm install

# Start dev server (nodemon)
npm run dev

# Start production server
npm start

# Check for vulnerabilities
npm audit
```

### Frontend
```powershell
# Install dependencies
npm install

# Start dev server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Useful File Locations

| What | Where |
|------|-------|
| Add new API route | `Backend/routes/` |
| Add business logic | `Backend/controller/` |
| Define database schema | `Backend/models/` |
| Add utility function | `Backend/utils/` |
| Add React component | `Frontend/src/components/` |
| Add new page | `Frontend/src/pages/` |
| Add Redux action | `Frontend/src/actions/` |
| Add Redux reducer | `Frontend/src/reducers/` |
| Configure global styles | `Frontend/src/index.css` or `tailwind.config.js` |

---

## Committing this file

To commit and push only this file (PowerShell):

```powershell
git add .test1/05_developer_notes.md
git commit -m "docs: add .test1/05_developer_notes.md — developer guidelines"
git push origin <your-branch-name>
```

Replace `<your-branch-name>` with your current branch.

---

**Ready for the last file?** Say "next" to add `06_release_and_git_workflow.md`.
