// src\app.js
import express from 'express'

// import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js
import { transactionsRouter, usersRouter } from './routes/index.js'

export const app = express() // Initialize Express app

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

// logs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})
