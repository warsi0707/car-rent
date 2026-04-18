import { Cashfree, CFEnvironment } from "cashfree-pg";
import type { Request, Response } from "express";
import BookingModel from "../models/booking.model.js";

const getCashfree = () =>
  new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY,
  );

export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const { amount, customerId, customerName, customerEmail, customerPhone, bookingId } = req.body;

    if (!amount || !customerId || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, customerId, customerName, customerEmail, customerPhone",
      });
    }

    const cashfree = getCashfree();
    const orderId = "order_" + Date.now();
    const baseUrl = (process.env.FRONTEND_URL || "").split(",")[0];

    const request = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: String(customerId),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${baseUrl}/payment-success?order_id=${orderId}`,
      },
      order_note: "Car booking payment",
    };

    const response = await cashfree.PGCreateOrder(request);

    // Link the Cashfree orderId to the booking so we can verify later
    if (bookingId) {
      await BookingModel.findByIdAndUpdate(bookingId, {
        cashfreeOrderId: orderId,
        paymentProvider: "cashfree",
      });
    }

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Cashfree createOrder Error:", error?.response?.data || error?.message);
    return res.status(error?.response?.status || 500).json({
      success: false,
      message: "Error creating payment order",
      details: error?.response?.data || (error instanceof Error ? error.message : String(error)),
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const cashfree = getCashfree();
    const response = await cashfree.PGFetchOrder(String(orderId));
    const orderData = response.data as any;
    const orderStatus: string = orderData?.order_status ?? "UNKNOWN";

    const booking = await BookingModel.findOne({ cashfreeOrderId: orderId }).populate(
      "car",
      "name brand model images slug pricePerDay currency category year fuelType transmission"
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found for this order" });
    }

    if (orderStatus === "PAID") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.paymentId = String(orderData?.cf_order_id ?? orderId);
      await booking.save();
    } else if (orderStatus === "EXPIRED" || orderStatus === "CANCELLED") {
      booking.paymentStatus = "failed";
      await booking.save();
    }

    return res.status(200).json({
      success: true,
      orderStatus,
      booking,
    });
  } catch (error: any) {
    console.error("Cashfree verifyPayment Error:", error?.response?.data || error?.message);
    return res.status(error?.response?.status || 500).json({
      success: false,
      message: "Error verifying payment",
      details: error?.response?.data || (error instanceof Error ? error.message : String(error)),
    });
  }
};
