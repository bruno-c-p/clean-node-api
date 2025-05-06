import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve("any_hash"))
  },
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe("BCrypt Adapter", () => {
  it("Should call bcrypt with correct values", async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.encrypt("any_value")
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  it("Should return a hash on success", async () => {
    const sut = makeSut()
    const hash = await sut.encrypt("any_value")
    expect(hash).toBe("any_hash")
  })

  it("Should throw if bcrypt throws", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(
        () => new Promise((resolve, reject) => reject(new Error()))
      )
    await expect(sut.encrypt("any_value")).rejects.toThrow()
  })
})
