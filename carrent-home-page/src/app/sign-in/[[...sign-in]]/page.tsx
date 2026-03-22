import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function page() {
  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
        <SignIn/>
    </div>
  )
}
