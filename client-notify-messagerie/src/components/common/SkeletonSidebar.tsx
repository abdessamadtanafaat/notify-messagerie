// src/components/SkeletonSidebar.tsx
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonSidebar = () => {
  return (
    <>
      <div className="flex h-screen w-20 flex-col justify-between border-e dark:border-gray-700 bg-white dark:bg-gray-800">
        <div>
          <div className="inline-flex size-20 items-center justify-center">
            <div className="flex items-center justify-center">
              <Skeleton circle height={64} width={64} />
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700">
            <div className="px-2">
              <ul className="space-y-6 border-gray-100 pt-2 dark:border-gray-700">
                <li className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:text-white dark:text-white"
                >
                  <Skeleton height={45} width={45} />
                </li>
                <li className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:text-white dark:text-white"
                >
                  <Skeleton height={45} width={45} />
                </li>
                <li className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:text-white dark:text-white"
                >
                  <Skeleton height={45} width={45} />
                </li>
                <li className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:text-white dark:text-white"
                >
                  <Skeleton height={45} width={45} />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700 bg-white p-2 dark:bg-gray-800 ">
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm dark:text-white text-gray-700  dark:hover:bg-gray-600"
          // onClick={handleLogout}
          >
            <Skeleton height={45} width={45} />

          </button>
        </div>
      </div>
      <div
        id="view"
        className="h-full w-screen flex flex-row dark:bg-gray-700"
        x-data="{ sidenav: true }"
      >
        <div
          id="sidebar"
          className="bg-white dark:bg-gray-800 h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
          x-show="sidenav"
        // @click.away="sidenav = false"
        >
          <div className="space-y-6 md:space-y-10 mt-10">
            <h1 className="hidden md:block font-bold text-sm md:text-xl text-center dark:text-white">
              <Skeleton height={37.5} width={150}/>
            </h1>
            <div className="relative flex">
              <Skeleton height={43.44} width={261.09} />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default SkeletonSidebar
