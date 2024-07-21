import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { RootState } from '../../store/store'
import SwitcherTheme from './SwitcherTheme'
import { useEffect } from 'react'
import { getUserInfo } from '../../store/userSlice'

const Sidebar: React.FC = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector((state: RootState) => state.auth.username)
  const id = useAppSelector((state: RootState) => state.auth.id)
  const user = useAppSelector((state: RootState) => state.user.user)


  useEffect(() => {
    console.log(id)
    if (id) {
      const infoData = dispatch(getUserInfo(id))
      console.log(id)
      console.log(infoData)
    }

  }, [id, dispatch])

  const handleLogout = async () => {

    if (!username) {
      console.error('No username available for logout')
    }

    try {
      const data = await dispatch(logout())
      navigate('/login')
      console.log(data)

    } catch (error) {
      console.error('Logout failed:', error)
    }

  }
  return (
    //     <div className="flex dark:bg-gray-800">

    // <div className="flex h-screen w-20 flex-col justify-between border-e dark:border-gray-700 bg-white dark:bg-gray-800">
    //   <div>
    //     <div className="inline-flex size-20 items-center justify-center">
    //       <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600 dark:bg-gray-700 dark:text-white">
    //         L
    //       </span>
    //     </div>
    //     <span className='flex items-center justify-center'>
    //         {user?.email}
    //     </span>
    //     <div className="border-t border-gray-100 dark:border-gray-700">
    //       <div className="px-2">
    //         <ul className="space-y-6 border-gray-100 pt-2 dark:border-gray-700">
    //           <li>
    //             <a
    //               href="#"
    //               className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
    //             >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="size-5 opacity-75"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    //               />
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    //               />
    //             </svg>

    //               <span
    //                 className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
    //               >
    //                 Teams
    //               </span>
    //             </a>
    //           </li>

    //           <li>
    //             <a
    //               href="#"
    //               className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="size-5 opacity-75"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 strokeWidth="2"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    //                 />
    //               </svg>

    //               <span
    //                 className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
    //               >
    //                 Teams
    //               </span>
    //             </a>
    //           </li>

    //           <li>
    //             <a
    //               href="#"
    //               className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="size-5 opacity-75"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 strokeWidth="2"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    //                 />
    //               </svg>

    //               <span
    //                 className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
    //               >
    //                 Billing
    //               </span>
    //             </a>
    //           </li>

    //           <li>
    //             <a
    //               href="#"
    //               className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="size-5 opacity-75"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 strokeWidth="2"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    //                 />
    //               </svg>

    //               <span
    //                 className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
    //               >
    //                 Invoices
    //               </span>
    //             </a>
    //           </li>

    //           <li>
    //             <a
    //               href="#"
    //               className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="size-5 opacity-75"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 strokeWidth="2"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    //                 />
    //               </svg>

    //               <span
    //                 className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
    //               >
    //                 Account
    //               </span>
    //             </a>
    //           </li>

    //           <li>
    //           <div
    //               className="group relative flex justify-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
    //             >
    //             <SwitcherTheme/>
    //           </div>
    //           </li>

    //         </ul>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700 bg-white p-2 dark:bg-gray-800 ">
    //       <button
    //         type="submit"
    //         className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm hover:bg-primary hover:text-white dark:text-white text-gray-700  dark:hover:bg-gray-600"
    //         onClick = {handleLogout}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="size-5 opacity-75"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    //           />
    //         </svg>

    //         <span
    //           className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible dark:text-white"
    //         >
    //           Logout
    //         </span>
    //       </button>
    //   </div>
    // </div>
    // </div>
    <div
      id="view"
      className="h-full w-screen flex flex-row dark:bg-gray-700"
      x-data="{ sidenav: true }"
    >
      <button
        // @click="sidenav = true"
        className="p-2 border-2 bg-white rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-teal-500 focus:outline-none focus:text-white absolute top-0 left-0 sm:hidden"
      >
        <svg
          className="w-5 h-5 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div
        id="sidebar"
        className="bg-white dark:bg-gray-800 h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
        x-show="sidenav"
      // @click.away="sidenav = false"
      >
        <div className="space-y-6 md:space-y-10 mt-10">
          <h1 className="font-bold text-4xl text-center md:hidden">
            D<span className="text-primary">.</span>
          </h1>
          <h1 className="hidden md:block font-bold text-sm md:text-xl text-center dark:text-white">
            Messenger<span className="text-primary "> .</span>
          </h1>
          <div id="profile" className="space-y-3">
            <img
              src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
              alt="Avatar user"
              className="w-10 md:w-16 rounded-full mx-auto"
            />
            <div>
              <h2
                className="font-medium text-xs md:text-sm text-center text-primary"
              >
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-xs text-gray-500 text-center dark:text-white">{user?.email}</p>
            </div>
          </div>
          <div id="menu" className="flex flex-col space-y-4">

            <div className="px-2">
              <ul className="space-y-6 border-gray-100 pt-2 dark:border-gray-700">
                <li>
                  <a
                    href="#"
                    className="group relative flex items-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="ml-2 text-sm font-medium opacity-75">Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group relative flex items-center rounded px-2 py-1.5 text-gray-700 hover:bg-primary hover:text-white dark:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="ml-2 text-sm font-medium opacity-75">Profile</span>
                  </a>
                </li>
              </ul>

              <div className="border-t mt-14 border-gray-400 dark:border-gray-700 bg-white p-2 dark:bg-gray-800 flex justify-between items-center">

                {/* SwitcherTheme Component */}
                <div className="group relative flex items-center rounded px-9 py-1.5 text-gray-700 dark:text-white">
                  <SwitcherTheme />
                </div>

                {/* Logout Button */}
                <button
                  type="submit"
                  className="group relative flex justify-center rounded-lg px-9 py-2 text-sm hover:bg-primary hover:text-white dark:text-white text-gray-700 dark:hover:bg-gray-600"
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 opacity-75"
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
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}


export default Sidebar
