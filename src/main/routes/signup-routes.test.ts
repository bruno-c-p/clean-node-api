import request from "supertest"
import { app } from "../config/app"

describe("Signup Routes", () => {
  it("should return 200 when signup is successful", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test",
        passwordConfirmation: "test",
      })
      .expect(200)
  })
})
