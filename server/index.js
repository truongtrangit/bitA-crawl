const express = require("express");
const cors = require("cors");
const database = require("./core/database");
const config = require("./core/config");
const { ProductModel } = require("./models");

function authenticate(req, res, next) {
  const apiKey = req.get("authorization");
  if (!apiKey || apiKey !== config.apiKey) {
    return res.status(400).json({ message: "Unauthenticated" });
  }
  next();
}

async function boot() {
  await database.connect(config.dbUri);

  const app = express();

  app.use(cors({ origin: "*" }));

  app.get("/", (req, res) => {
    return res.json({ status: "OK" });
  });

  app.get("/api/v1/products", authenticate, async (req, res) => {
    const { page = 0, limit = 10, query } = req.query;

    if (page < 0 || limit < 0) {
      return res
        .status(400)
        .json({ message: "Invalid format of page or limit" });
    }

    if (page < 0 || limit < 0) {
      return res
        .status(400)
        .json({ message: "Invalid format of page or limit" });
    }

    let queryCond = {};
    if (query) {
      const regex = new RegExp(query, "gi");
      queryCond["$or"] = [{ name: regex }, { slug: regex }];
    }

    const products = await ProductModel.find(queryCond)
      .skip(page * limit)
      .limit(limit)
      .lean();

    const total = await ProductModel.countDocuments(queryCond);

    return res.status(200).json({
      paging: {
        page,
        limit,
        total,
      },
      data: products,
    });
  });

  app.get("/healthCheck", (req, res) => {
    return res.status(200).json({ health: "OK" });
  });

  app.listen(config.port, () => {
    console.log(`Server is running at port:`, config.port);
  });
}

async function stop() {
  await database.stop();
}

boot();
