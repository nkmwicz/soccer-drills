import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates the app when you push changes
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "soccer-ball.svg"],
      manifest: {
        name: "Soccer Drills Pro",
        short_name: "SoccerDrills",
        description: "Training app for the garage",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "fullscreen", // This makes it feel like a real app (no browser bars)
        start_url: "/?fullscreen=true", // Helpful hint for some Android versions
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Ensures the icon looks good on Android
          },
        ],
      },
      workbox: {
        // This ensures all your JS, CSS, and images are cached for offline garage use
        globPatterns: ["**/*.{js,css,html,png,svg,jpg}"],
      },
    }),
  ],
});
