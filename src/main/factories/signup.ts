import { DbAddAccount } from "@/data/usecases/add-account/db-add-account"
import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account"
import { LogMongoRepository } from "@/infra/db/mongodb/log-repository/log"
import { LogControllerDecorator } from "@/main/decorators/log"
import { SignUpController } from "@/presentation/controllers/signup/signup"
import type { Controller } from "@/presentation/protocols"
import { EmailValidatorAdapter } from "@/utils/email-validator-adapter"

export const makeSignUpController = (): Controller => {
  const SALT = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(SALT)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    addAccount
  )
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
