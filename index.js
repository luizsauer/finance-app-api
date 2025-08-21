// index.js
import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules

import { app } from './src/app.cjs' // Import the Express app

// Start the Express server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
