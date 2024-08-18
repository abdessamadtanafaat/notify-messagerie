/* eslint-disable @typescript-eslint/no-explicit-any */

import { logout } from '../../store/authSlice'
import { useAppDispatch } from '../../hooks/reduxHooks'
import SwitcherTheme from './SwitcherTheme'
import { useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import { Archive, MessageCircleMore, MessagesSquareIcon, Send, Settings, Users } from 'lucide-react'
import SkeletonSidebar from './SkeletonSidebar'
import { useAuth } from '../../contexte/AuthContext'
import { Link } from 'react-router-dom'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl } from '../../utils/userUtils'
import Profile from '../profile/Profile'


const Sidebar: React.FC = () => {

  const dispatch = useAppDispatch()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeItem, setActiveItem] = useState<string>('')
  const [showProfileComponent, setShowProfileComponent] = useState<boolean>(false)
  

  const handleImageClick = (fromAvatarClick: boolean, itemName: string) => {

    if (fromAvatarClick){
      setShowProfileComponent(!showProfileComponent)
    } else {
      handleClick(itemName)
      setShowProfileComponent(false)
    }
  }

  const {theme} = useThemeContext()

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
    
    <>
      {loading && !isAuthenticated ? (
        <SkeletonSidebar />
      ) : (
        <>
          <div className="flex fixed h-full flex-col rounded-2xl justify-between border-e dark:border-gray-700 bg-gray-200 dark:bg-gray-700 overflow-y-auto overflow-x-hidden">
            <div>
              <div className="inline-flex size-14 items-center justify-center">
              <Link
               to="/profile"
               onClick={()=> handleImageClick(false,'profile') }
>
                <div className="flex items-center justify-center">
                    <img
                    src={getAvatarUrl(theme,user ?? {})}
                    alt="Avatar user"
                        className="w-10 h-10 md:w-10 md:h-10 rounded-full object-cover cursor-pointer"
                    />
                </div>
            </Link>
              </div>
              <span className='flex items-center justify-center'>
              </span>
              <div className="border-gray-300 dark:border-gray-700">
                <div className="px-2">
                  <ul className="space-y-5 border-gray-100 pt-2 dark:border-gray-700">
                    <li>
                      <Link
                        to="/discussions"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'discussions' ? 'bg-primary text-white' : ''}`}
                        onClick={()=> handleImageClick(false,'discussions') }
                        >
                        <MessagesSquareIcon />

                        <span
                          className="invisible absolute z-50 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                          Discussions
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/personnes"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'personnes' ? 'bg-primary text-white' : ''}`}
                        onClick={()=> handleImageClick(false,'personnes')}
                        >
                        <Send/>

                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                          Personnes
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/friends"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'friends' ? 'bg-primary text-white' : ''}`}
                        onClick={()=> handleImageClick(false,'friends')}
                        >
                        <Users />

                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                          Friends
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/demandes"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'demandes' ? 'bg-primary text-white' : ''}`}
                        onClick={()=> handleImageClick(false,'demandes')}
                        >
                        <MessageCircleMore />

                        <span
                          className="invisible absolute z-20 start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-600 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                          Demandes
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="archive"
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'archive' ? 'bg-primary text-white' : ''}`}
                        onClick={()=> handleImageClick(false,'archive')}
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
                        className={`group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600 ${activeItem === 'settings' ? 'bg-primary text-white' : ''}`}
                        onClick={()=> handleImageClick(false,'settings')}
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
          <li>
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

          </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
          {showProfileComponent && <Profile/>}
        </>
      )}
    </>

  )
}


export default Sidebar
