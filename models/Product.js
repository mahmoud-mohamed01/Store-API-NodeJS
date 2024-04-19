import mongoose from "mongoose";

const Shcema = mongoose.Schema;

const productSchema = new Shcema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  newPrice: {
    type: Number,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
  avilable: {
    type: Boolean,
    default: 1,
  },
  inventory: {
    type: Number,
    default: 15,
  },
});

export default mongoose.model("Product", productSchema);
