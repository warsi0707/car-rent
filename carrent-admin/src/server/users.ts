"use server";
import { cookies } from "next/headers";

const handleGetCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const getUsers = async (limit = 50, offset = 0) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users?limit=${limit}&offset=${offset}`,
    {
      headers: {
        Cookie: await handleGetCookies(),
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch users: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const banUser = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/ban/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await handleGetCookies(),
    },
  });
  return res.json();
};

export const unbanUser = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/unban/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await handleGetCookies(),
    },
  });
  return res.json();
};
