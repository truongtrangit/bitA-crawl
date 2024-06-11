const mongoose = require("mongoose");

class Deferred {
  constructor() {
    this.reset();
  }

  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

function delay(Ms) {
  return new Promise((resolve) => setTimeout(resolve, Ms));
}

const connectDatabase = async (dbUri) => {
  const activeDbDef = new Deferred();

  const dbIns = mongoose.createConnection(dbUri);
  dbIns.on("connected", function () {
    console.log(`DB ${dbUri} connected`);
    activeDbDef.resolve();
  });

  await activeDbDef.promise;

  return dbIns;
};

module.exports = { delay, connectDatabase };
