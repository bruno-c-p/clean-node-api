import request from "supertest"
import { app } from "../config/app"

describe("Content-Type Middleware", () => {
  it("should return default content type as json", async () => {
    app.get("/test-content-type", (req, res) => {
      res.send("")
    })

    await request(app).get("/test-content-type").expect("Content-Type", /json/)
  })

  it("should return xml when forced", async () => {
    app.get("/test-content-type-xml", (req, res) => {
      res.type("application/xml")
      res.send("<xml></xml>")
    })

    await request(app)
      .get("/test-content-type-xml")
      .expect("Content-Type", /xml/)
  })
})
