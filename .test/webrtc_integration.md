# WebRTC Integration Notes — Low-Bandwidth Optimization

This file gives practical guidance for implementing the HD Video Calling feature in CureConnect with a focus on maintaining service quality in low-bandwidth, high-latency, or lossy networks.

## Architecture overview

- Use a small signaling server (WebSocket or HTTPS) to exchange SDP and ICE candidates.
- Prefer an SFU (Selective Forwarding Unit) like Janus, Jitsi Videobridge, or mediasoup when supporting multi-party or to offload encoding complexity from clients.
- For simple 1:1 calls, a TURN server (coturn) is essential to ensure connectivity behind NATs.

## Codec and transport recommendations

- Default to H.264 (broad device support and hardware acceleration) with VP8 as a fallback. Offer AV1 where supported for even greater compression efficiency, but only as an option for capable clients.
- Use Opus for audio — it's robust for low-bitrate/high-loss scenarios.
- Enable DTLS-SRTP for all media to meet privacy and compliance needs.

## Low-bandwidth strategies

- Adaptive Bitrate (ABR): Use the browser's built-in bandwidth estimation (getStats) and allow the app to switch encoder parameters (maxBitrate) dynamically.
- Simulcast & SVC (scalable video coding): Publish multiple encodings (high/medium/low) to let the SFU forward the best stream to each participant depending on available bandwidth.
- Audio-first UX: Detect very low bandwidth and drop to audio-only with a clear UI that lets the user re-enable video if conditions improve.
- Reduce framerate before resolution: For human face interactions, lowering framerate (e.g., from 30fps to 10–15fps) often preserves perceived quality while cutting bandwidth.
- Keyframe tuning: Use longer GOPs and tune keyframe intervals to avoid spikes in bandwidth usage while staying responsive to scene changes.

## Signaling and session management

- Lightweight signaling: send only necessary SDP/ICE updates and throttle re-negotiations during short network blips.
- Connection health checks: use periodic getStats snapshots and show a network-quality indicator to users.
- Fallback flows: allow users to upload a still image or switch to an asynchronous consultation mode when real-time connectivity is impossible.

## TURN and NAT traversal

- Deploy a TURN server (coturn) in a regionally-distributed setup or rely on cloud-hosted TURN for global reach.
- Monitor TURN usage metrics and set quotas to avoid unexpected costs.

## Instrumentation & monitoring

- Track metrics: packet loss, jitter, RTT, current bitrate, and frames per second per session.
- Log and expose aggregated metrics to ops so the system can auto-scale SFU/TURN resources.

## UX considerations

- Inform users when the system has downgraded to audio-only or low-res video; provide an option to retry at higher quality.
- Provide a "low-data mode" toggle for users on metered connections.

## Security and privacy

- Ensure signaling endpoints require authentication (JWT or session cookies).
- Avoid logging raw media or PII in monitoring traces.

## Example: simple client-side bitrate change (concept)

/*
Pseudo-code: when network deteriorates, reduce the encoder max bitrate.
*/

// const sender = pc.getSenders().find(s => s.track.kind === 'video');
// const parameters = sender.getParameters();
// parameters.encodings = parameters.encodings || [{}];
// parameters.encodings[0].maxBitrate = 150_000; // 150kbps
// await sender.setParameters(parameters);

## Why these choices help CureConnect

- Minimize data usage for cost-sensitive rural users while keeping clinical interactions possible.
- Improve connection resilience so clinicians can rely on the platform in critical situations.
- Lower barriers for adoption (no extra apps, works in-browser) which is important in communities that share devices or have limited technical literacy.

---

If you'd like, I can also add a small demo page or a sample client snippet under `.test/` that shows how to toggle audio-only mode and change maxBitrate programmatically.
