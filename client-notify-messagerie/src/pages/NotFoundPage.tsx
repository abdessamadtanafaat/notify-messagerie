import React from 'react'

export default function NotFoundPage() {
  return (
    <>
<div className="grid h-screen place-content-center bg-white px-4">
  <div className="text-center">

          <img
            src='\src\assets\error.png'
            alt="Avatar user"
            className="w-10 h-10 md:w-52 md:h-52 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
          />
    <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</h1>

    <p className="mt-4 text-gray-500">We can't find that page.</p>
  </div>
</div>
    </>

  )
}
