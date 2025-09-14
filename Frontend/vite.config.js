import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "agpatil-frontend.onrender.com",
      ".onrender.com",
    ],
    hmr: {
      clientPort: 443, // Important for HTTPS in production
    },
    proxy: {
      "/api/v1": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: true,
        ws: true,
        cookieDomainRewrite: {
          "*": "", // This will rewrite the cookie domain to match the request origin
        },
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Add headers that Cloudflare expects
            proxyReq.setHeader("X-Forwarded-Proto", "https");
            proxyReq.setHeader("Origin", req.headers.host);
            console.log("Sending Request to the Target:", req.method, req.url);
            console.log("Request Headers:", proxyReq.getHeaders());
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
            console.log("Response Headers:", proxyRes.headers);
          });
        },
      },
    },
  },
});
