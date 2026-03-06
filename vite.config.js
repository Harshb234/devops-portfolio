import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import crypto from 'node:crypto'

// Polyfill for crypto.hash which is missing in Node 20.x
if (!crypto.hash) {
    crypto.hash = function (algorithm, data, output) {
        const hash = crypto.createHash(algorithm).update(data)
        return output === 'buffer' ? hash.digest() : hash.digest(output || 'hex')
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        host: true,
        port: 5173
    }
})
