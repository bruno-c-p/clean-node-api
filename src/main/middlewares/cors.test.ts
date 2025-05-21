import { app } from "@/main/config/app"
import request from "supertest"

describe("CORS Middleware", () => {
  it("should enable CORS", async () => {
    app.get("/test-cors", (req, res) => {
      res.send()
    })

    await request(app)
      .get("/test-cors")
      .expect("Access-Control-Allow-Origin", "*")
      .expect("Access-Control-Allow-Methods", "*")
      .expect("Access-Control-Allow-Headers", "*")
  })
})
