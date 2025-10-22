# HD Video Calling via WebRTC (Optimized for Low Bandwidth)

This file expands the short README entry for CureConnect's HD Video Calling feature and explains why this capability is especially valuable for the project.

## Feature summary

- Real-time video consultations between patients and doctors using WebRTC.
- Adaptive bitrate and dynamic resolution switching to preserve call continuity on slow links (2G/3G/poor 4G).
- Low-latency audio-first mode when video must be deprioritized.
- Optional hardware-accelerated codecs (H.264 / VP8 / AV1 fallback) to improve quality-per-bit.
- End-to-end transport security using DTLS-SRTP for media and secure signaling channels.

## Why this is a better fit for CureConnect

CureConnect targets rural and low-bandwidth environments. The WebRTC implementation is built and tuned with that constraint as a first-class requirement.

- Accessibility: WebRTC runs in modern browsers and many mobile devices without additional apps. Patients can join consultations from low-end phones or shared community devices.
- Resilience on poor networks: Adaptive bitrate, simulcast, and layered codecs mean the call remains usable when bandwidth fluctuates — crucial for remote areas where dropouts would otherwise ruin consultations.
- Reduced data cost: Efficient codec choices and aggressive bandwidth adaptation reduce cellular data consumption for users who pay by usage.
- Better clinical outcomes: Keeping the patient and clinician connected even with degraded video allows a clinician to continue with audio-guided exams, posture/skin checks with low-res video, or switch to still-image capture when bandwidth is insufficient.
- Privacy & compliance: Using secure WebRTC transports and encrypted signaling helps meet privacy requirements for health data.

## Short user-visible benefits

- Connect from low-end phones or shared public kiosks.
- Start a call quickly — the system automatically chooses the best quality settings.
- Falls back gracefully to audio-only or low-resolution video instead of dropping the session.

---

Any further integration notes and implementation recommendations are provided in `webrtc_integration.md`.
