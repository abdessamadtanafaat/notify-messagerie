

import { useLocation } from 'react-router-dom'
import Sidebar from '../common/Sidebar'
import { shouldShowSidebar } from '../../utils/routeUtils'



const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const showSidebar = shouldShowSidebar(location.pathname)
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
