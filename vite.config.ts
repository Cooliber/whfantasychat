import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for better development experience
      fastRefresh: true,
      // Include .tsx files in Fast Refresh
      include: "**/*.{jsx,tsx}",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      "@components": path.resolve(__dirname, "client", "src", "components"),
      "@stores": path.resolve(__dirname, "client", "src", "stores"),
      "@types": path.resolve(__dirname, "client", "src", "types"),
      "@hooks": path.resolve(__dirname, "client", "src", "hooks"),
      "@utils": path.resolve(__dirname, "client", "src", "utils"),
      "@lib": path.resolve(__dirname, "client", "src", "lib"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Optimize build performance for Netlify
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          utils: ['zustand', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Enable source maps for better debugging in production
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize chunk size for Netlify deployment
    chunkSizeWarningLimit: 1000,
    // Ensure assets are properly handled
    assetsDir: 'assets',
    // Generate manifest for better caching
    manifest: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Enable HMR for better development experience
    hmr: {
      overlay: true,
    },
    // Optimize development server
    host: true,
    port: 5173,
    // Proxy API calls to Netlify functions in development
    proxy: {
      '/api': {
        target: process.env.NETLIFY_DEV ? 'http://localhost:8888' : 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      'framer-motion',
    ],
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
  },
  // Define environment variables for client-side
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  // Environment variables configuration
  envPrefix: ['VITE_', 'NETLIFY_'],
});
