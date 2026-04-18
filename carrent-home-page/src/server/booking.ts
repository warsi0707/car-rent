interface CreateBookingPayload {
  carSlug: string
  userClerkId: string
  userEmail: string
  userName: string
  startDate: string
  endDate: string
  pickup?: { city: string; addressLine: string }
  dropoff?: { city: string; addressLine: string }
  addOns?: { name: string; price: number }[]
  notes?: string
  securityDeposit?: number
}

export const createBooking = async (data: CreateBookingPayload) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/bookings/create`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Booking failed' }))
    throw new Error(err.message || 'Failed to create booking')
  }
  return res.json()
}

export const getAvailibility = async (carSlug: string, startDate: string, endDate: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/cars/available?carSlug=${carSlug}&startDate=${startDate}&endDate=${endDate}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to check availability' }))
    throw new Error(err.message || 'Failed to check availability')
  }
  return res.json()
}

export const getBookings = async (userId:string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/bookings/user/${userId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to fetch bookings' }))
    throw new Error(err.message || 'Failed to fetch bookings')
  }
  return res.json()
}