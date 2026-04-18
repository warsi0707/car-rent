"use server";
import { cookies } from "next/headers";

const handleGetCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const getBookings = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/bookings`, {
    headers: {
      Cookie: await handleGetCookies(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch bookings: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const updateBooking = async (id: string, data: { status?: string; paymentStatus?: string }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/bookings/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: await handleGetCookies(),
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update booking: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const deleteBooking = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/bookings/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: await handleGetCookies(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete booking: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};
