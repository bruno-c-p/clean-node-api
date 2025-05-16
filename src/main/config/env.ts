export default {
  PORT: process.env.PORT || 3000,
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb://mongo-clean-node-api:27017/clean-node-api",
}
