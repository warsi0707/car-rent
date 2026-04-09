"use server";
import { cookies } from "next/headers";

const handleGetCookies = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString(); // 🔥 important
  console.log("cookieStore :", cookieHeader);
  return cookieHeader;
};

// server/car.ts

export const getCars = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars`, {
    headers: {
      Cookie: await handleGetCookies(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch cars: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const getCar = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars/${id}`, {
    headers: {
      Cookie: await handleGetCookies(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch cars: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};


export const updateCar =async(id:string,data:any)=>{
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: await handleGetCookies(), // 🔥 manually pass cookie
      },
      body: JSON.stringify(data),
    })
    return res.json();
  }catch(error){
    console.error("Error updating car:", error);
  }
}

export const createCar =async(data:any)=>{
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await handleGetCookies(), // 🔥 manually pass cookie
      },
      body: JSON.stringify(data),
    })
    return res.json();
  }catch(error){
    console.error("Error creating car:", error);
  }
}

export const deleteCar =async(id:string)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: await handleGetCookies(), // 🔥 manually pass cooki
      },
    })
    return res.json();
  
}
