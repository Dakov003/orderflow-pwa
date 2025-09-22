import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'OrderFlow PWA',
        short_name: 'OrderFlow',
        description: 'OrderFlow PWA - Gestiune Comenzi',
        start_url: '/',
        display: 'standalone',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        icons: [
          { 
            src: 'pwa-192x192.png', 
            sizes: '192x192', 
            type: 'image/png' 
          },
          { 
            src: 'pwa-512x512.png', 
            sizes: '512x512', 
            type: 'image/png' 
          },
          { 
            src: 'pwa-512x512-maskable.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'maskable' 
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          // Cache pentru API Firebase (firestore.googleapis.com)
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { 
              cacheName: 'firestore-api', 
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Cache pentru fonts și CDN-uri comune
          { 
            urlPattern: /^https:\/\/(fonts|cdn)\./i, 
            handler: 'StaleWhileRevalidate', 
            options: { cacheName: 'assets-cdn' } 
          },
          // Cache pentru imagini
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          ui: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
