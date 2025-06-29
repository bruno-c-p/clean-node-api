import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve("any_hash"))
  },

  async compare(): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  },
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe("BCrypt Adapter", () => {
  it("Should call hash with correct values", async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.hash("any_value")
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })

  it("Should return a valid hash on hash success", async () => {
    const sut = makeSut()
    const hash = await sut.hash("any_value")
    expect(hash).toBe("any_hash")
  })

  it("Should throw if hash throws", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "hash")
      .mockImplementationOnce(
        () => new Promise((resolve, reject) => reject(new Error()))
      )
    await expect(sut.hash("any_value")).rejects.toThrow()
  })

  it("Should call compare with correct values", async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, "compare")
    await sut.compare("any_value", "any_hash")
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash")
  })

  it("Should return true if compare returns true", async () => {
    const sut = makeSut()
    const isValid = await sut.compare("any_value", "any_hash")
    expect(isValid).toBe(true)
  })

  it("Should return false if compare returns false", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => new Promise(resolve => resolve(false)))
    const isValid = await sut.compare("any_value", "any_hash")
    expect(isValid).toBe(false)
  })

  it("Should throw if compare throws", async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(
        () => new Promise((resolve, reject) => reject(new Error()))
      )
    await expect(sut.compare("any_value", "any_hash")).rejects.toThrow()
  })
})
