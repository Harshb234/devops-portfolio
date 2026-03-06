import { createServer } from 'vite'
import crypto from 'node:crypto'

// Polyfill for crypto.hash which is missing in Node 20.x
if (!crypto.hash) {
    crypto.hash = function (algorithm, data, output) {
        const hash = crypto.createHash(algorithm).update(data)
        return output === 'buffer' ? hash.digest() : hash.digest(output || 'hex')
    }
}

async function start() {
    try {
        const server = await createServer({
            configFile: './vite.config.js',
            server: {
                port: 5173,
            },
        })
        await server.listen()
        console.log('--- SERVER STARTED AT http://localhost:5173 ---')
        server.printUrls()
    } catch (e) {
        console.error('--- STARTUP ERROR ---')
        console.error(e)
        process.exit(1)
    }
}

start()
