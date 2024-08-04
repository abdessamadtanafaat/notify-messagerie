import React from 'react'

function SecondSidbar() {
  return (
                <div 
            id="view"
            className="h-full w-screen flex flex-row dark:bg-gray-700"
            x-data="{ sidenav: true }"
          >
          <div
              id="sidebar"
              className="bg-white dark:bg-gray-800 h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-80 overflow-x-hidden transition-transform duration-300 ease-in-out"
              x-show="sidenav"
            // @click.away="sidenav = false"
            >
              <div className="space-y-6 md:space-y-10 mt-10">
                <h1 className="hidden md:block font-bold text-sm md:text-xl text-center dark:text-white">
                  Discussions
                </h1>
                <div className="relative flex">
                  <input
                    type="search"
                    className="relative m-0 block flex-auto rounded border border-solid border-neutral-200 bg-transparent bg-clip-padding px-2 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary"
                    placeholder="Search"
                    aria-label="Search"
                    id="exampleFormControlInput2"
                    aria-describedby="button-addon2"
                  />
                </div>
              </div>
            </div>
          </div>
  )
}

export default SecondSidbar
