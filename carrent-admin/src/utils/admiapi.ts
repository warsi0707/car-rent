const adminApi =async (url:any, data:any, method:any)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const result = await res.json()
    return result
}