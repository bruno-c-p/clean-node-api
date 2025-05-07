import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper"

import env from "./config/env"

MongoHelper.connect(env.MONGO_URL)
  .then(async () => {
    const { app } = await import("./config/app")
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`)
    })
  })
  .catch(err => {
    console.error(err)
  })
