interface CreatePaymentOrderPayload {
  amount: number
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  bookingId: string
}

export const createPaymentOrder = async (data: CreatePaymentOrderPayload) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/create-payment`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Payment order creation failed' }))
    throw new Error(err.message || 'Failed to create payment order')
  }
  return res.json()
}

export const verifyPayment = async (orderId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/verify/${orderId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Payment verification failed' }))
    throw new Error(err.message || 'Failed to verify payment')
  }
  return res.json()
}
