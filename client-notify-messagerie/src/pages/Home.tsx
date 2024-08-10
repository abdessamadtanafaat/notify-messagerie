import React from 'react'

function Home() {
  return (
    <>
      <div className="grid h-screen place-content-center">
        <div className="text-center">
          <img
            src='src/assets/ChatApp.png'
            alt="Avatar user"
            className="w-10 h-10 md:w-52 md:h-52 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
          />

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Welcome !</h1>

          <p className="mt-4 text-gray-500">Start talk to your friends.</p>
        </div>
      </div>
    </>
  )
}

export default Home
