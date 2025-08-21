import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartProductModel = mongoose.model("cartProduct", cartProductSchema);

export default CartProductModel;