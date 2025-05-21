import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper"
import { app } from "@/main/config/app"
import request from "supertest"

describe("Signup Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

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
