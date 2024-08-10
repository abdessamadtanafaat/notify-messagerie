

import { useLocation } from 'react-router-dom'
import Sidebar from '../common/Sidebar'
import { shouldShowSidebar } from '../../utils/routeUtils'
import NextSidebar from '../common/NextSidebar'



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const showSidebar = shouldShowSidebar(location.pathname)
    return (
        <div className="flex h-screen overflow-x-hidden"> 
            {showSidebar && <Sidebar />}
            <div className={`flex flex-1 ml-${showSidebar ? '64' : '0'} transition-all duration-300 ease-in-out`}>
                {showSidebar && <NextSidebar />}
                <div className={`flex-1 ml-${showSidebar ? '1/6' : '0'} p-4 overflow-y-auto`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
