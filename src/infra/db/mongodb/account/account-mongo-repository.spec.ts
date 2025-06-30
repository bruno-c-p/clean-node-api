import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper"
import type { Collection } from "mongodb"
import { AccountMongoRepository } from "./account-mongo-repository"

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })

  it("should return an account on success", async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: "valid_name",
      email: "valid_email@valid_email.com",
      password: "valid_password",
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("valid_name")
    expect(account.email).toBe("valid_email@valid_email.com")
    expect(account.password).toBe("valid_password")
  })

  it("should return an account on loadByEmail success", async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@any_email.com",
      password: "any_password",
    })
    const account = await sut.loadByEmail("any_email@any_email.com")
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("any_name")
    expect(account.email).toBe("any_email@any_email.com")
    expect(account.password).toBe("any_password")
  })
})
