/* eslint-disable @typescript-eslint/no-explicit-any */

import { logout } from '../../store/authSlice'
import { useAppDispatch } from '../../hooks/reduxHooks'
import SwitcherTheme from './SwitcherTheme'
import { useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import { Archive, MessagesSquareIcon, Users } from 'lucide-react'
import SkeletonSidebar from './SkeletonSidebar'
import { useAuth } from '../../contexte/AuthContext'
import { Link } from 'react-router-dom'
import defaultAvatar from '../../assets/default-avatar.png' // Adjust the path as necessary
import defaultAvatarNight from '../../assets/default-avatar-night.png' // Dark theme
import { useThemeContext } from '../../contexte/ThemeContext'


const Sidebar: React.FC = () => {

  const dispatch = useAppDispatch()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeItem, setActiveItem] = useState<string>('')


    const {theme} = useThemeContext()

    const getAvatarUrl  = (theme: string , user?: {avatarUrl?: string}) => {
      if(user?.avatarUrl){
        return user.avatarUrl
      }
      return theme === 'dark' ? defaultAvatarNight : defaultAvatar
    }
    
    // Determine which avatar image to use based on the theme
    const avatarUrl = getAvatarUrl(theme,user)
    
  const handleLogout = async () => {
    try {
      if (!user || !user.id) {
        console.error('Username is not available for logout')
        return
      }

      await dispatch(logout({ userId: user?.id }))
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }


  const handleClick = (itemName: string) => {
    setActiveItem(itemName)
  }

  return (
    <div className="flex dark:bg-gray-800">
      {loading && !isAuthenticated ? (
        <SkeletonSidebar />
      ) : (
        <>
          <div className="flex h-screen w-20 flex-col justify-between border-e dark:border-gray-700 bg-white dark:bg-gray-800">
            <div>
              <div className="inline-flex size-20 items-center justify-center">
                <div className="flex items-center justify-center">

                  <img
                    src={avatarUrl}
                    alt="Avatar user"
                    className="w-10 h-10 md:w-10 md:h-10 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className='flex items-center justify-center'>
                {/* {user?.email} */}
              </span>
              <div className="border-t border-gray-100 dark:border-gray-700">
                <div className="px-2">
                  <ul className="space-y-6 border-gray-100 pt-2 dark:border-gray-700">
                    <li>
                      <Link
                        to="/test"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'discussions' ? 'bg-primary text-white' : ''}`}
                        onClick={() => handleClick('discussions')}
                      >
                        <MessagesSquareIcon />

                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                          Discussions
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/personnes"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'users' ? 'bg-primary text-white' : ''}`}
                        onClick={() => handleClick('users')}
                      >
                        <Users />

                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                          Personnes
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="archive"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'archive' ? 'bg-primary text-white' : ''}`}
                        onClick={() => handleClick('archive')}
                      >
                        <Archive />
                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"

                        >
                          Archive
                        </span>
                      </Link>
                    </li>
                    <li>
                      <div
                        className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
                      >
                        <SwitcherTheme />
                      </div>
                    </li>

                  </ul>
                </div>
              </div>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700 bg-white p-2 dark:bg-gray-800 ">
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm hover:bg-primary hover:text-white dark:text-white text-gray-700  dark:hover:bg-gray-600"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http:www.w3.org/2000/svg"
                  className="size-5 opacity-75"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>

                <span
                  className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Logout
                </span>
              </button>
            </div>
          </div>

          <div
            id="view"
            className="h-full w-screen flex flex-row dark:bg-gray-700"
            x-data="{ sidenav: true }"
          >
            {/* <button
            //  @click="sidenav = true"
            className="p-2 border-2 bg-white rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-teal-500 focus:outline-none focus:text-white absolute top-0 left-0 sm:hidden"
          >
            <svg
              className="w-5 h-5 fill-current"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http:www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button> */}
            <div
              id="sidebar"
              className="bg-white dark:bg-gray-800 h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
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
                  {/* <span
                    className="flex items-center whitespace-nowrap px- py-[0.25rem] text-surface dark:border-neutral-400 dark:text-white [&>svg]:h-5 [&>svg]:w-5"
                    id="button-addon2">
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

  )
}


export default Sidebar
