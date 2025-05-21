import { DbAddAccount } from "./db-add-account"
import type {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./db-add-account-protocols"

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@valid_email.com",
  password: "hashed_password",
})

const makeFakeAddAccount = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email@valid_email.com",
  password: "valid_password",
})

type SutTypes = {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe("DbAddAccount Usecase", () => {
  it("Should call Encrypter with correct password", () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
    sut.add(makeFakeAddAccount())
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })

  it("Should throw if Encrypter throws", () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    expect(sut.add(makeFakeAddAccount())).rejects.toThrow()
  })

  it("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")
    await sut.add(makeFakeAddAccount())
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@valid_email.com",
      password: "hashed_password",
    })
  })

  it("Should throw if AddAccountRepository throws", () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    expect(sut.add(makeFakeAddAccount())).rejects.toThrow()
  })

  it("Should return an account on success", async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toEqual(makeFakeAccount())
  })
})
