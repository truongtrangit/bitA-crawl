const mongoose = require("mongoose");

async function connect(DB_URI) {
  try {
    const db = mongoose.connection;
    db.on("connecting", () => {
      console.info("[DB] connecting to MongoDB...");
    });
    db.on("error", (error) => {
      console.error(`[DB] Error in MongoDb connection: ${error}`);
    });
    db.on("connected", () => {
      console.info("[DB] MongoDB connected!");
    });
    db.once("open", () => {
      console.info("[DB] MongoDB connection opened!");
    });
    db.on("reconnected", () => {
      console.info("[DB] MongoDB reconnected!");
    });
    db.on("disconnected", () => {
      console.warn("[DB] MongoDB disconnected!");
    });

    await mongoose.connect(DB_URI);
  } catch (error) {
    throw new Error("Can not connect DB. Error:", error);
  }
}

async function getIns() {
  return mongoose.connection.db;
}

async function stop() {
  await mongoose.connection.close();
}

module.exports = { connect, getIns, stop };
