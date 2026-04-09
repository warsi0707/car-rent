"use server";
import { IAddon } from "@/app/(dashboard)/addons/page";
import { cookies } from "next/headers";

const handleGetCookies = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString(); // 🔥 important
  console.log("cookieStore :", cookieHeader);
  return cookieHeader;
};

// server/car.ts

export const createAddon = async (data:IAddon) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addons/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: await handleGetCookies(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create addon: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const getAddons = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addons`, {
    method: "GET",
    headers: {
      Cookie: await handleGetCookies(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch addons: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const getAddon = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addons/${id}`, {
    method: "GET",
    headers: {
      Cookie: await handleGetCookies(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch addon: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const deleteAddon = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addons/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: await handleGetCookies(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete addon: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const updateAddon    = async (id: string, data: IAddon) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addons/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: await handleGetCookies(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update addon: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};