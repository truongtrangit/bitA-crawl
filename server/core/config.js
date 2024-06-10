module.exports = {
  dbUri: process.env.DB_URI || "mongodb://localhost:27017",
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY,
};
