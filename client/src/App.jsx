import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import axios from "axios"

function App() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    // Test API connection
    axios.get("http://localhost:5000/health")
      .then(response => setHealth(response.data))
      .catch(error => console.error("API connection failed:", error))
  }, [])

  return (
    <Router>
      <div className="App">
        <header>
          <h1>MERN Deployment App</h1>
          {health && (
            <div style={{ background: "#27ae60", color: "white", padding: "0.5rem" }}>
              ✅ Backend Connected - {health.environment} mode
            </div>
          )}
        </header>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to MERN Deployment</h2>
      <p>This app is configured for production deployment with CI/CD</p>
      
      <div style={{ marginTop: "2rem" }}>
        <h3>Test the API:</h3>
        <button onClick={() => window.open("http://localhost:5000/api/test", "_blank")}>
          Test Backend API
        </button>
        <button onClick={() => window.open("http://localhost:5000/api/users", "_blank")}>
          View Users API
        </button>
      </div>
    </div>
  )
}

function HealthCheck() {
  const [healthData, setHealthData] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:5000/health")
      .then(response => setHealthData(response.data))
  }, [])

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Health Check</h2>
      {healthData ? (
        <pre>{JSON.stringify(healthData, null, 2)}</pre>
      ) : (
        <p>Loading health data...</p>
      )}
    </div>
  )
}

function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(response => setUsers(response.data.users))
  }, [])

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  )
}

export default App
