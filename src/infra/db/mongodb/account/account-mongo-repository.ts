import type { AddAccountRepository } from "@/data/protocols/db/account/add-account-repository"
import type { LoadAccountByEmailRepository } from "@/data/usecases/authentication/db-authentication-protocols"
import type { AccountModel } from "@/domain/models/account"
import type { AddAccountModel } from "@/domain/usecases/add-account"
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper"

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts")
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: result.insertedId })
    return MongoHelper.map(account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts")
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }
}
