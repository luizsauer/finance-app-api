// src\app.cjs
const express = require('express') 
const { transactionsRouter, usersRouter } = require('./routes/index.js')
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const path = require('path')
const { fileURLToPath } = require('url')
// import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express() // Initialize Express app

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    console.log('Params:', req.params)
    console.log('Query:', req.query)
    console.log('Body:', req.body)
    console.log(`Requisição feita em: ${new Date()}`)
    next() // segue para o próximo middleware ou rota
})

app.use(express.json()) // Middleware to parse JSON bodies -> faz o parsing de JSON no corpo da requisição

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

// Swagger documentation
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8'),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// logs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

module.exports = { app } // Export the app for use in other files