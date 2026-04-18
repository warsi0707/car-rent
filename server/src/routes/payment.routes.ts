import express, { Router } from 'express'
import { createPaymentOrder, verifyPayment } from '../controller/payment.controller.js';

const PaymentRouter = Router()

PaymentRouter.post("/create-payment", createPaymentOrder)
PaymentRouter.get("/verify/:orderId", verifyPayment)

export default PaymentRouter;