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
 * SkinAnalysisModal Component:
 *   - Purpose: Entry point for dermatological condition detection and analysis
 *   - Features:
 *     • Dual analysis modes: Image-based and Video-based skin assessment
 *     • Advanced Framer Motion animations with spring physics
 *     • Rose/Pink gradient theme for dermatology focus
 *     • Glassmorphism effects with backdrop blur
 *     • Interactive hover states with scale and lift transformations
 *     • Floating decorative medical icons (Sparkles, Scan)
 *     • 3D rotation effects on modal entrance
 *   - Animation Variants:
 *     • backdropVariants: Fade in/out with 50% opacity black overlay + blur
 *     • modalVariants: 3D rotateX transform (-15deg) with spring animation
 *     • cardVariants: Horizontal slide-in (-30px) with staggered delay (0.15s)
 *     • iconVariants: Rotate from -180deg with scale-up effect
 *     • pulseVariants: Infinite breathing animation (1-1.05 scale, 2s duration)
 *     • floatingVariants: Vertical oscillation (-2px to 2px, 3s duration)
 *   - Color Scheme:
 *     • Primary: Rose (rose-500, rose-600, rose-800)
 *     • Secondary: Pink (pink-500, pink-600, pink-800)
 *     • Accents: Fuchsia for video card variation
 *     • Backgrounds: Gradient from white to gray-50 (f8fafc)
 *   - User Flow:
 *     1. User clicks skin analysis option from dashboard
 *     2. Modal presents two dermatology analysis options
 *     3. Image route: /analysis/skin (static skin condition photos)
 *     4. Video route: /analysis/skin-video (dynamic skin assessment)
 *   - Card Design:
 *     • Image Card: Rose gradient (rose-50 to pink-50) with rose borders
 *     • Video Card: Pink gradient (pink-50 to fuchsia-50) with pink borders
 *     • Border animations: Transitions from 50% to 80% opacity on hover
 *     • Background overlay: Animated gradient fill on hover (0 to 100% opacity)
 *   - Interactive Elements:
 *     • Close button: 90deg rotation + 1.1x scale on hover
 *     • Card lift: -5px vertical translation on hover
 *     • Arrow indicator: Slides from -10px to 0, fades in on hover
 *     • Tap animation: 0.98 scale for tactile feedback
 *   - Layout & Spacing:
 *     • Modal: max-w-md (28rem), p-8 padding, rounded-3xl corners
 *     • Cards: p-6 padding, rounded-2xl corners, space-y-4 gap
 *     • Icons: w-6 h-6 (24px), w-8 h-8 for header (32px)
 *     • Footer divider: w-12 h-1, animated width expansion
 *   - Accessibility:
 *     • Click-to-close backdrop with stopPropagation on modal
 *     • Keyboard-accessible buttons
 *     • Clear visual hierarchy with size and color
 *     • Descriptive text for screen readers
 *   - Tech Stack: React, Framer Motion, React Router, Lucide Icons
 *   - Design Philosophy: Medical trust (rose/pink), approachable UI, 
 *                       smooth animations for reduced anxiety
 * 
 * ECGAnalysisModal Component:
 *   - Purpose: Entry point for electrocardiogram heart rhythm analysis
 *   - Features:
 *     • Dual analysis modes: Image-based and Video-based ECG monitoring
 *     • Advanced Framer Motion animations with cardiac-inspired effects
 *     • Emerald/Red gradient theme for cardiology focus (heart health colors)
 *     • Glassmorphism effects with backdrop blur
 *     • Interactive hover states with scale and lift transformations
 *     • Floating decorative medical icons (Zap, Heart)
 *     • Unique heartbeat animation variant for medical authenticity
 *   - Animation Variants:
 *     • backdropVariants: Fade in/out with 50% opacity black overlay + blur
 *     • modalVariants: 3D rotateX transform (-15deg) with spring animation
 *     • cardVariants: Horizontal slide-in (-30px) with staggered delay (0.15s)
 *     • iconVariants: Rotate from -180deg with scale-up effect
 *     • pulseVariants: Infinite breathing animation (1-1.05 scale, 2s duration)
 *     • heartbeatVariants: ECG-inspired animation [1, 1.2, 1, 1.1, 1] (1.5s, infinite)
 *     • floatingVariants: Vertical oscillation (-2px to 2px, 3s duration)
 *   - Color Scheme:
 *     • Primary: Emerald (emerald-500, emerald-600, emerald-800) - healthy heart
 *     • Secondary: Red (red-500, red-600, red-800) - heart alert/monitoring
 *     • Accent: Green for image card, Rose for video card
 *     • Backgrounds: Gradient from white to gray-50 (f8fafc)
 *   - User Flow:
 *     1. User clicks ECG analysis option from dashboard
 *     2. Modal presents two cardiology analysis options
 *     3. Image route: /analysis/ecg (static ECG graph upload)
 *     4. Video route: /analysis/ecg-video (dynamic heart monitoring)
 *   - Card Design:
 *     • Image Card: Emerald gradient (emerald-50 to green-50) with emerald borders
 *     • Video Card: Red gradient (red-50 to rose-50) with red borders
 *     • Border animations: Transitions from 50% to 80% opacity on hover
 *     • Background overlay: Animated gradient fill on hover (0 to 100% opacity)
 *   - Special Animation Features:
 *     • Heartbeat Icon: Custom heartbeat pattern animation in background
 *     • Zap Icon: Floating animation representing electrical cardiac activity
 *     • Activity Icon: Main header icon with pulse animation
 *     • Gradient header: Emerald to red representing cardiac spectrum
 *   - Interactive Elements:
 *     • Close button: 90deg rotation + 1.1x scale on hover
 *     • Card lift: -5px vertical translation on hover
 *     • Arrow indicator: Slides from -10px to 0, fades in on hover
 *     • Tap animation: 0.98 scale for tactile feedback
 *   - Layout & Spacing:
 *     • Modal: max-w-md (28rem), p-8 padding, rounded-3xl corners
 *     • Cards: p-6 padding, rounded-2xl corners, space-y-4 gap
 *     • Icons: w-6 h-6 (24px), w-8 h-8 for header (32px)
 *     • Footer divider: w-12 h-1, emerald-to-red gradient, animated width
 *   - Medical Context:
 *     • ECG = Electrocardiogram: Records electrical signals from the heart
 *     • Image analysis: Static ECG graphs/printouts from medical devices
 *     • Video analysis: Real-time or recorded ECG monitor screens
 *     • Color psychology: Green (healthy), Red (alert/monitoring)
 *   - Accessibility:
 *     • Click-to-close backdrop with stopPropagation on modal
 *     • Keyboard-accessible buttons
 *     • Clear visual hierarchy with size and color
 *     • Descriptive text: "Cardiology Heart Monitoring"
 *   - Tech Stack: React, Framer Motion, React Router, Lucide Icons
 *   - Design Philosophy: Medical urgency (red), vitality (emerald), 
 *                       heartbeat animations for emotional connection
 * 
 * Other Analysis Modals (Similar Architecture):
 *   - XRayAnalysisModal: X-ray image interpretation (gray/slate theme)
 *   - RetinopathyAnalysisModal: Diabetic eye disease screening (amber/orange theme)
 *   - PETAnalysisModal: Positron Emission Tomography scan analysis (purple/violet theme)
 * 
 * APPOINTMENT SYSTEM
 * ------------------
 * AppointmentBooking Component:
 *   - Purpose: Comprehensive appointment scheduling system with AI integration
 *   - Features:
 *     • Intelligent doctor search and filtering by name/specialty
 *     • Real-time slot availability checking
 *     • AI-powered symptom analysis using Gemini AI
 *     • Dynamic form validation with detailed error messages
 *     • Date range restrictions (30 days advance booking)
 *     • Past date/time prevention with validation
 *     • Grid-based doctor card display with selection states
 *     • Time slot formatting (12-hour format with AM/PM)
 *     • Responsive modal overlay with backdrop blur
 *     • Loading states for doctors, slots, and AI generation
 *   - Redux Integration:
 *     • allDoctors: Fetches and displays available doctors
 *     • newAppointment: Handles appointment creation
 *     • availableSlots: Dynamic slot fetching based on doctor/date
 *     • clearErrors: Error handling and toast notifications
 *   - AI Symptom Analysis:
 *     • Triggers on symptoms input (minimum 20 characters)
 *     • Generates health suggestions using Gemini AI
 *     • Markdown rendering with ReactMarkdown + remark-gfm
 *     • Styled output with gradient backgrounds and prose styling
 *     • Loading indicator during AI processing
 *   - Form Fields:
 *     1. Doctor Selection: Searchable grid with DoctorCard components
 *     2. Date Selection: Calendar input with min/max validation
 *     3. Time Slot Selection: Grid of available slots (3 columns)
 *     4. Description: Textarea for appointment reason (min 10 chars)
 *     5. Symptoms: Textarea triggering AI analysis (min 10 chars)
 *   - User Flow:
 *     1. Search and select doctor from grid
 *     2. Choose date (validates future dates only)
 *     3. System fetches available time slots
 *     4. Select time from available slots
 *     5. Describe appointment reason and symptoms
 *     6. AI analyzes symptoms and provides suggestions
 *     7. Submit booking with comprehensive validation
 *   - Validation Rules:
 *     • Doctor must be selected
 *     • Date must be within 30 days and not in past
 *     • Time must be available and not in past (for today)
 *     • Description minimum 10 characters
 *     • Symptoms minimum 10 characters for AI analysis
 *   - UI/UX Features:
 *     • Lucide icons for visual clarity (Calendar, Clock, User, etc.)
 *     • Color-coded states (selected, hover, disabled)
 *     • Gradient backgrounds for AI suggestions section
 *     • Smooth transitions and hover effects
 *     • Max height scrollable sections with overflow handling
 *     • Toast notifications for errors and success
 *   - Tech Stack: React, Redux, Lucide Icons, ReactMarkdown, 
 *                 Gemini AI, React Toastify
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
 * HEALTH TIPS & EDUCATION
 * ------------------------
 * HealthTips Component (Main):
 *   - Purpose: Interactive health education platform with searchable content
 *   - Features:
 *     • 24 curated health tips covering 5 categories
 *     • Real-time search functionality (title, description, category)
 *     • Category-based filtering (Daily Habits, Nutrition, Fitness, Rest, Mental Health)
 *     • Pagination system (9 tips per page)
 *     • Sequential animation on page load
 *     • External YouTube video links for detailed guidance
 *     • Responsive grid layout (1-3 columns)
 *     • Color-coded category badges
 *   - Categories Covered:
 *     1. Daily Habits: Hydration, posture, active breaks, morning sunlight
 *     2. Nutrition: Mindful eating, balanced diet, protein intake, healthy snacking
 *     3. Fitness: Regular exercise, strength training, cardio, flexibility
 *     4. Rest: Quality sleep, sleep environment optimization
 *     5. Mental Health: Stress management, gratitude, nature time, digital detox
 *   - Interactive Elements:
 *     • Search bar with clear functionality
 *     • Category filter buttons with active state
 *     • Hover effects on tip cards
 *     • Arrow icon for external links
 *     • Pagination controls (Previous/Next + page numbers)
 *   - Animation System:
 *     • Staggered entrance (150ms delay between cards)
 *     • Fade-in and scale transformations
 *     • Smooth transitions on category/search changes
 *     • 300ms initial delay before animation sequence
 *   - Data Structure:
 *     Each tip contains: id, title, description, icon (Lucide), 
 *     color class, category, and YouTube link
 *   - User Flow:
 *     1. View all tips or filter by category
 *     2. Search specific health topics
 *     3. Read tip summaries with visual icons
 *     4. Click "Learn More" to watch educational videos
 *     5. Navigate through pages for more content
 *   - Tech Stack: React, Lucide Icons, Tailwind CSS, YouTube integration
 * 
 * CancerHealthTips Component (Specialized):
 *   - Purpose: Cancer prevention education and awareness
 *   - Features:
 *     • 5 essential cancer prevention tips
 *     • Card-based layout with hover effects
 *     • Icon-driven visual communication
 *     • Gradient background (rose to pink)
 *     • Shadow effects on card hover
 *     • Centered responsive design
 *   - Prevention Topics:
 *     1. Healthy Diet: Fruits, vegetables, whole grains, lean proteins
 *     2. Physical Activity: 30 minutes daily exercise
 *     3. Avoid Tobacco & Limit Alcohol: Leading cancer cause prevention
 *     4. Sun Protection: Sunscreen, protective clothing, avoid tanning
 *     5. Regular Screenings: Early detection (mammograms, colonoscopies)
 *   - Design Elements:
 *     • Color-coded icons (green, blue, teal, yellow, pink)
 *     • Rounded card corners (2xl)
 *     • Shadow transitions on hover
 *     • Motivational footer message
 *     • Full-screen gradient background
 *   - UI/UX:
 *     • Mobile-responsive grid (1-3 columns)
 *     • Emoji-enhanced headings for engagement
 *     • Clean, minimal card design
 *     • Centered text alignment for readability
 *   - Tech Stack: React, Lucide Icons, shadcn/ui Card component, 
 *                 Tailwind CSS
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
