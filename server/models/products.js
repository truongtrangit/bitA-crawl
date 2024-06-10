const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  slug: String,
  price: Number,
  originalPrice: Number,
  discountPercentage: Number,
  sold: String,
  stars: Number,
  address: String,
  image: String,
  thumbnail: [String],
});

productSchema.index({ slug: -1 });

module.exports = mongoose.model("products", productSchema);
