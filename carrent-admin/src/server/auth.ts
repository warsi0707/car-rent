
export const signIn = async (data:any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/auth/signin`, {
    method: 'POST',
    headers: {
    //   Cookie: await handleGetCookies(),
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch cars: ${res.status} - ${text.slice(0, 200)}`);
  }

  return res.json();
};

export const signUp =async(data: any)=>{
    console.log(process.env.NEXT_BACKEND_URL)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    const result = await res.json()
    return result
}


export const signOut =async()=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/auth/signout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const result = await res.json()
    return result
}