import bcrypt from "bcrypt"
import { BcryptAdapter } from "./bcrypt-adapter"

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
})
