import React from 'react'
import Sidebar from '../common/Sidebar'
import { useLocation } from 'react-router-dom'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const location = useLocation() 

    const hideSidebarRoutes = [    
        '/login',
        '/register',
        '/reset-password-by-email',
        '/reset-password-byPhoneNumber',

    ]

    const showSidebar = !hideSidebarRoutes.includes(location.pathname)

    return (
            <>
                {showSidebar && <Sidebar />}
                <div className={showSidebar ? 'flex-1' : 'flex-1'}>
                    {children}
                </div>
            </>
   )
}
export default Layout
