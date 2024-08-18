

import { useLocation } from 'react-router-dom'
import Sidebar from '../common/Sidebar'
import { shouldShowSidebar } from '../../utils/routeUtils'



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const showSidebar = shouldShowSidebar(location.pathname)
    return (

        <div className="flex flex-col p-4 overflow-hidden min-h-screen bg-gray-200 dark:bg-gray-600">
            {showSidebar && (                    
                    <Sidebar />
            )}
            {
        <main className="flex-grow overflow-x-hidden">
                   {children}
                </main>
            }

        </div>
    )
    
    
    
    
    
}

export default Layout
