"use server"
export const getAddons =async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/addons`, {
        method: "GET",
    })
    const data = await res.json()
    return data.addons
}