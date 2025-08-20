// index.js
import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import express from 'express'

// import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js
import { transactionsRouter, usersRouter } from './src/routes/index.js'

const app = express() // Initialize Express app

app.use(express.json()) // Middleware to parse JSON bodies -> faz o parsing de JSON no corpo da requisição

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    console.log('Params:', req.params)
    console.log('Query:', req.query)
    console.log('Body:', req.body)
    console.log(`Requisição feita em: ${new Date()}`)
    next() // segue para o próximo middleware ou rota
})

// logs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

// app.use((err, req, res) => {
//     console.error('Unhandled error:', err)
//     res.status(500).json({
//         message: 'Internal Server Error',
//         error: err.message,
//     })
// })

// Start the Express server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

export { app } // Export the app for testing or other purposes
