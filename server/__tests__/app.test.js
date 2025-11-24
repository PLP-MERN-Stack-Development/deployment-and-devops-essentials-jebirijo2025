import request from "supertest"
import app from "../server.js"

describe("API Tests", () => {
  test("Health check endpoint", async () => {
    const response = await request(app).get("/health")
    expect(response.status).toBe(200)
    expect(response.body.status).toBe("OK")
  })

  test("Test endpoint", async () => {
    const response = await request(app).get("/api/test")
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("API is working! 🚀")
  })
})
