/**
 * ============================================================================
 * CURECONNECT - FRONTEND OVERVIEW
 * ============================================================================
 * 
 * Project: CureConnect Healthcare Platform
 * Description: A comprehensive healthcare management system with AI-powered
 *              medical analysis, telemedicine, and pharmacy management.
 * 
 * ============================================================================
 * TECH STACK
 * ============================================================================
 * - Framework: React (Vite)
 * - State Management: Redux
 * - Styling: Tailwind CSS
 * - HTTP Client: Axios
 * - Internationalization: i18next
 * - Build Tool: Vite
 * 
 * ============================================================================
 * CORE FEATURES
 * ============================================================================
 * 
 * 1. MEDICAL AI ANALYSIS
 *    - Alzheimer's detection via video/image analysis
 *    - Cancer screening and analysis
 *    - ECG (Electrocardiogram) analysis
 *    - X-Ray image analysis
 *    - Skin condition analysis
 *    - Diabetic retinopathy detection
 *    - PET scan analysis
 * 
 * 2. TELEMEDICINE & APPOINTMENTS
 *    - Doctor discovery and profile browsing
 *    - Appointment booking and management
 *    - Video call consultations
 *    - Real-time chat functionality
 *    - Medical assistant chatbot
 * 
 * 3. PRESCRIPTION & PHARMACY
 *    - Digital prescription management
 *    - Medicine catalog browsing
 *    - Shopping cart and checkout
 *    - Order tracking system
 *    - Pharmacy registration and dashboard
 *    - Pharmacist admin panel
 * 
 * 4. PATIENT MANAGEMENT
 *    - User authentication and profiles
 *    - Medical history tracking
 *    - QR code patient identification
 *    - Health tips and educational content
 *    - PDF report generation
 * 
 * ============================================================================
 * FOLDER STRUCTURE
 * ============================================================================
 * 
 * /src
 *   /actions        - Redux action creators for state management
 *   /assets         - Images, icons, and static resources
 *   /components     - Reusable UI components (modals, cards, forms)
 *   /constants      - Redux action type constants
 *   /locales        - Translation files (English, Hindi, Kannada, Marathi)
 *   /pages          - Route-level page components
 *   /reducers       - Redux reducers for state updates
 *   /styles         - Custom CSS and styling
 *   /utils          - Helper functions and utilities
 * 
 * ============================================================================
 * KEY COMPONENTS
 * ============================================================================
 * 
 * ANALYSIS MODALS (AI-POWERED MEDICAL ANALYSIS)
 * ----------------------------------------------
 * AlzheimerAnalysisModal Component:
 *   - Purpose: Entry point for Alzheimer's disease detection and analysis
 *   - Features:
 *     • Dual analysis modes: Image-based and Video-based detection
 *     • Advanced Framer Motion animations (backdrop, modal, cards, icons)
 *     • Gradient-based UI with glassmorphism effects
 *     • Interactive hover states with scale and position transformations
 *     • Floating background medical icons for visual appeal
 *     • Navigation integration for seamless routing
 *   - Animation Variants:
 *     • backdropVariants: Fade in/out with blur effect
 *     • modalVariants: 3D transform with spring physics
 *     • cardVariants: Staggered entrance with hover/tap interactions
 *     • iconVariants: Rotate and scale on appearance
 *     • pulseVariants: Continuous breathing animation
 *     • floatingVariants: Infinite floating motion
 *   - User Flow:
 *     1. User clicks brain analysis option from main dashboard
 *     2. Modal presents two options: Image or Video analysis
 *     3. Image route: /analysis/alzheimer (static brain scan upload)
 *     4. Video route: /analysis/alzheimer-video (dynamic scan analysis)
 *   - Tech Stack: React, Framer Motion, React Router, Lucide Icons
 *   - Design: Gradient colors (indigo/teal), rounded corners, hover effects
 * 
 * Other Analysis Modals (Similar Architecture):
 *   - ECGAnalysisModal: Electrocardiogram heart rhythm analysis
 *   - XRayAnalysisModal: X-ray image interpretation
 *   - SkinAnalysisModal: Dermatological condition detection
 *   - RetinopathyAnalysisModal: Diabetic eye disease screening
 *   - PETAnalysisModal: Positron Emission Tomography scan analysis
 * 
 * APPOINTMENT SYSTEM
 * ------------------
 * - Booking, scheduling, and management
 * - Doctor discovery and profile viewing
 * - Real-time availability checking
 * 
 * VIDEO CALL & TELEMEDICINE
 * -------------------------
 * - Real-time video consultations
 * - WebRTC integration for peer-to-peer connections
 * - Screen sharing and chat functionality
 * 
 * PHARMACY COMPONENTS
 * -------------------
 * - Medicine catalog and search
 * - Shopping cart and checkout
 * - Order tracking and management
 * 
 * USER MANAGEMENT
 * ---------------
 * - Authentication and profile management
 * - Medical history and records
 * - QR code patient identification
 * 
 * ============================================================================
 * STATE MANAGEMENT
 * ============================================================================
 * Redux store handles:
 * - User authentication and session
 * - Appointment data and scheduling
 * - Prescription and medicine catalog
 * - Pharmacy and order management
 * 
 * ============================================================================
 * INTERNATIONALIZATION
 * ============================================================================
 * Multi-language support for:
 * - English (en)
 * - Hindi (hi)
 * - Kannada (kn)
 * - Marathi (mr)
 * 
 * ============================================================================
 * CLOUD INTEGRATION
 * ============================================================================
 * - Cloudinary for image/video uploads and storage
 * - Backend API integration via Axios
 * 
 * ============================================================================
 */
