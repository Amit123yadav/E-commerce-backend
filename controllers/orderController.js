import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js";
import { stripe } from "../server.js";

// create order controller
export const createOderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethods,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
      orderStatus,
    } = req.body;
    // validation
    if (
      !shippingInfo ||
      !orderItems ||
      !paymentMethods ||
      !itemPrice ||
      !tax ||
      !shippingCharges ||
      !totalAmount
    ) {
      return res.status(500).send({
        success: false,
        message: "required all fields",
      });
    }

    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethods,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
      orderStatus,
    });
    for (let i = 0; i < orderItems.length; i++) {
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "order created successfully ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create order Api",
    });
  }
};

// get all orders controller
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).send({
      success: true,
      message: "User orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Get All Orders Api",
    });
  }
};

// get single order controller
export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "No order found with this ID",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single order fetched successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in get single order api",
    });
  }
};

// get user payment controller
export const getUserPaymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const amountInCents = totalAmount * 100; // Convert to cents
    if (!totalAmount) {
      return res.status(400).send({
        success: false,
        message: "Total amount is required",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).send({
      success: true,
      message: "Payment intent created successfully",
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get user payment api",
    });
  }
};

// admin controllers can be added here
export const adminGetAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).send({
      success: true,
      message: "All orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in admin get all orders api",
    });
  }
};

// change order status controller
export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "No order found with this ID",
      });
    }

    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "delivered";
      order.deliveryAt = Date.now();
    }else{
      res.status(400).send({
        success: false,
        message: "Order is already delivered",
      });
      return; 
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in change order status api",
    });
  }
};
