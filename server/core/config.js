module.exports = {
  env: process.env.NODE_ENV || "dev",
  dbUri: process.env.DB_URI || "mongodb://localhost:27017",
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY,
  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCertPath: process.env.SSL_CERT_PATH,
};
