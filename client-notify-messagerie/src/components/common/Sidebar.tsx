/* eslint-disable @typescript-eslint/no-explicit-any */

import { logout } from '../../store/authSlice'
import { useAppDispatch } from '../../hooks/reduxHooks'
import SwitcherTheme from './SwitcherTheme'
import { useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import { Archive, MessagesSquareIcon, Settings, Users } from 'lucide-react'
import SkeletonSidebar from './SkeletonSidebar'
import { useAuth } from '../../contexte/AuthContext'
import { Link } from 'react-router-dom'
import defaultAvatar from '../../assets/default-avatar.png' // Adjust the path as necessary
import defaultAvatarNight from '../../assets/default-avatar-night.png' // Dark theme
import { useThemeContext } from '../../contexte/ThemeContext'
import UpdateProfile from '../UpdateProfile'


const Sidebar: React.FC = () => {

  const dispatch = useAppDispatch()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeItem, setActiveItem] = useState<string>('')
  const [showProfileComponent, setShowProfileComponent] = useState<boolean>(false)

  const handleImageClick = () => {
    setShowProfileComponent(!showProfileComponent)
  }

    const {theme} = useThemeContext()

    const getAvatarUrl  = (theme: string , user?: {avatarUrl?: string}) => {
      if(user?.avatarUrl){
        return user.avatarUrl
      }
      return theme === 'dark' ? defaultAvatarNight : defaultAvatar
    }
    
    // Determine which avatar image to use based on the theme
    const avatarUrl = getAvatarUrl(theme,user ?? {})
    
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
                    className="w-10 h-10 md:w-10 md:h-10 rounded-full object-cover cursor-pointer"
                    onClick={handleImageClick}
                  />
                </div>
              </div>
              <span className='flex items-center justify-center'>
              </span>
              <div className="border-t border-gray-300 dark:border-gray-700">
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
                      <Link
                        to="settings"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'archive' ? 'bg-primary text-white' : ''}`}
                        onClick={() => handleClick('settings')}
                      >
                        <Settings />
                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"

                        >
                          Settings
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
            <div className="sticky inset-x-0 bottom-0 border-t border-gray-300 dark:border-gray-700 bg-white p-2 dark:bg-gray-800 ">
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
          {showProfileComponent && <UpdateProfile/>}
        </>
      )}
    </div>

  )
}


export default Sidebar
