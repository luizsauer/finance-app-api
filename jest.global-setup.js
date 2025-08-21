// jest.global-setup.js

import { execSync } from 'child_process'

async function init() {
    // Global setup logic
    execSync('docker compose up -d --wait postgres-test')
    execSync('npx prisma db push')
    // execSync('npm run migrate:latest', { stdio: 'inherit' })
}

export default init
