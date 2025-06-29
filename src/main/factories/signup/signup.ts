import { DbAddAccount } from "@/data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import { LogMongoRepository } from "@/infra/db/mongodb/log/log-mongo-repository"
import { LogControllerDecorator } from "@/main/decorators/log-controller-decorator"
import { SignUpController } from "@/presentation/controllers/signup/signup-controller"
import type { Controller } from "@/presentation/protocols"
import { makeSignUpValidator } from "./signup-validation-factory"

export const makeSignUpController = (): Controller => {
  const SALT = 12
  const encrypter = new BcryptAdapter(SALT)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const signUpController = new SignUpController(
    addAccount,
    makeSignUpValidator()
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
