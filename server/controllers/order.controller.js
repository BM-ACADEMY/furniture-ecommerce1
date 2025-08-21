import Razorpay from "razorpay";
import crypto from "crypto";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // From auth middleware
    const { list_items, addressId } = request.body;

    // Validate input
    if (!list_items || !addressId) {
      return response.status(400).json({
        message: "Provide list_items and addressId",
        error: true,
        success: false,
      });
    }

    // Calculate individual order prices and include quantity
    const payload = list_items.map((el) => {
      const productPrice = pricewithDiscount(el.productId.price, el.productId.discount);
      const itemTotal = productPrice * el.quantity; // Price * Quantity
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        quantity: el.quantity, // Explicitly set quantity
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: itemTotal, // Price for this product only
        totalAmt: itemTotal, // Same as subTotalAmt for now (no additional fees)
      };
    });

    // Insert orders
    const generatedOrder = await OrderModel.insertMany(payload);

    // Clear cart
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return response.json({
      message: "Order created successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to create order",
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 0) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);
  return actualPrice;
};

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // From auth middleware
    const { list_items, addressId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.body;

    // Validate input
    if (!list_items || !addressId) {
      return response.status(400).json({
        message: "Provide list_items and addressId",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // If razorpay payment details are provided, verify and create order
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      // Verify payment signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return response.status(400).json({
          message: "Invalid payment signature",
          error: true,
          success: false,
        });
      }

      // Create order payload
      const payload = list_items.map((el) => {
        const productPrice = pricewithDiscount(el.productId.price, el.productId.discount);
        const itemTotal = productPrice * el.quantity;
        return {
          userId: userId,
          orderId: `ORD-${new mongoose.Types.ObjectId()}`,
          productId: el.productId._id,
          product_details: {
            name: el.productId.name,
            image: el.productId.image,
          },
          quantity: el.quantity,
          paymentId: razorpay_payment_id,
          payment_status: "Online Payments",
          delivery_address: addressId,
          subTotalAmt: itemTotal,
          totalAmt: itemTotal,
        };
      });

      // Insert orders
      const generatedOrder = await OrderModel.insertMany(payload);

      // Clear cart
      await CartProductModel.deleteMany({ userId: userId });
      await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

      return response.json({
        message: "Payment verified and order created successfully",
        error: false,
        success: true,
        data: generatedOrder,
      });
    }

    // If no payment details, create a Razorpay order
    const totalAmount = list_items.reduce((sum, item) => {
      const price = pricewithDiscount(item.productId.price, item.productId.discount);
      return sum + price * item.quantity;
    }, 0);

    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${new mongoose.Types.ObjectId()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return response.status(200).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      email: user.email,
      success: true,
    });
  } catch (error) {
    console.log("Payment error:", error.message);
    return response.status(500).json({
      message: error.message || "Failed to initiate or verify payment",
      error: true,
      success: false,
    });
  }
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;

    const orderList = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("productId")
      .populate("userId", "name email");

    return response.json({
      message: "Order list",
      data: orderList,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllOrdersController(request, response) {
  try {
    const orderList = await OrderModel.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("productId")
      .populate("userId", "name email");

    return response.json({
      message: "All orders",
      data: orderList,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function cancelOrderController(request, response) {
  try {
    const userId = request.userId;
    const { orderId, cancellationReason } = request.body;

    if (!orderId || !cancellationReason) {
      return response.status(400).json({
        message: "Provide orderId and cancellationReason",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findOne({ orderId, userId });

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    if (order.isCancelled) {
      return response.status(400).json({
        message: "Order is already cancelled",
        error: true,
        success: false,
      });
    }

    if (order.tracking_status === "Shipped" || order.tracking_status === "Delivered") {
      return response.status(400).json({
        message: "Cannot cancel order that is Shipped or Delivered",
        error: true,
        success: false,
      });
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId, userId },
      {
        isCancelled: true,
        cancellationReason,
        cancellationDate: new Date(),
        tracking_status: "Cancelled",
      },
      { new: true }
    );

    return response.json({
      message: "Order cancelled successfully",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updateTrackingStatusController(request, response) {
  try {
    const userId = request.userId; // From auth middleware
    const { orderId, tracking_status } = request.body;

    if (!orderId || !tracking_status) {
      return response.status(400).json({
        message: "Provide orderId and tracking_status",
        error: true,
        success: false,
      });
    }

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(tracking_status)) {
      return response.status(400).json({
        message: "Invalid tracking status",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findOne({ orderId, isDeleted: false });
    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    if (order.isCancelled) {
      return response.status(400).json({
        message: "Cannot update tracking for cancelled order",
        error: true,
        success: false,
      });
    }

    // Prevent moving backward in tracking status
    const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = statusOrder.indexOf(order.tracking_status);
    const newIndex = statusOrder.indexOf(tracking_status);
    if (newIndex <= currentIndex && order.tracking_status !== "Pending") {
      return response.status(400).json({
        message: "Cannot revert to a previous tracking status",
        error: true,
        success: false,
      });
    }

    // Update tracking status and add to history
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId },
      {
        tracking_status,
        $push: {
          tracking_history: {
            status: tracking_status,
            updatedBy: userId,
          },
        },
      },
      { new: true }
    )
      .populate("delivery_address")
      .populate("productId")
      .populate("userId", "name email");

    return response.json({
      message: "Tracking status updated successfully",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to update tracking status",
      error: true,
      success: false,
    });
  }
}

export async function deleteOrderController(request, response) {
  try {
    const { orderId } = request.params;

    if (!orderId) {
      return response.status(400).json({
        message: "Provide orderId",
        error: true,
        success: false,
      });
    }

    const order = await OrderModel.findOne({ orderId, isDeleted: false });
    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    if (order.tracking_status === "Delivered") {
      return response.status(400).json({
        message: "Cannot delete a delivered order",
        error: true,
        success: false,
      });
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId },
      { isDeleted: true },
      { new: true }
    );

    return response.json({
      message: "Order deleted successfully",
      data: updatedOrder,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to delete order",
      error: true,
      success: false,
    });
  }
}

export async function getOrderStatsController(request, response) {
  try {
    const totalUsers = await UserModel.countDocuments({ role: "USER" });
    const totalOrders = await OrderModel.countDocuments({ isDeleted: false });
    const canceledOrders = await OrderModel.countDocuments({
      isDeleted: false,
      isCancelled: true,
    });
    const deliveredOrders = await OrderModel.countDocuments({
      isDeleted: false,
      tracking_status: "Delivered",
    });

    return response.json({
      message: "Order statistics",
      data: {
        totalUsers,
        totalOrders,
        canceledOrders,
        deliveredOrders,
        receivedOrders: totalOrders - canceledOrders - deliveredOrders, // Pending, Processing, Shipped
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to fetch order statistics",
      error: true,
      success: false,
    });
  }
}