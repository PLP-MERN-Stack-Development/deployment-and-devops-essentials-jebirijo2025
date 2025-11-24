import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"))
} else {
  app.use(morgan("dev"))
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: "mock (development mode)",
    environment: process.env.NODE_ENV || "development"
  })
})

// Test API endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working! 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  })
})

// Sample endpoints
app.get("/api/users", (req, res) => {
  res.json({
    message: "Users endpoint",
    users: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ]
  })
})

app.get("/api/products", (req, res) => {
  res.json({
    message: "Products endpoint",
    products: [
      { id: 1, name: "Product 1", price: 29.99 },
      { id: 2, name: "Product 2", price: 39.99 }
    ]
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.message
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  })
})

const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || "development"} mode
📍 Port: ${PORT}
🌐 URL: http://localhost:${PORT}
📊 Database: 🔧 Mock (Development Mode)

📋 Available endpoints:
   GET /health - Health check
   GET /api/test - Test endpoint  
   GET /api/users - Users endpoint
   GET /api/products - Products endpoint

💡 To use real MongoDB:
   1. Install MongoDB locally or use MongoDB Atlas
   2. Update MONGODB_URI in .env file
  `)
})

export default app
