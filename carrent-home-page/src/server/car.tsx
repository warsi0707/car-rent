export const getCars =async(limit: number, offset: any)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars/public?limit=${limit}&offset=${offset}`, {
        method: "GET",
    })
    const data = await res.json()
    return data.cars
}

export const getCar = async (slugOrId: string) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/cars/public/${slugOrId}`,
        { method: "GET", cache: "no-store" }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.car
}