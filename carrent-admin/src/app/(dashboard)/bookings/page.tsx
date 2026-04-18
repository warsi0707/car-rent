import BookingsPage from '@/pages/BookingsPage'
import { getBookings } from '@/server/booking'

export default async function page() {
  const res = await getBookings()
  return <BookingsPage bookings={res.bookings ?? []} />
}
