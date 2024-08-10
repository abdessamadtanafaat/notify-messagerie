import React from 'react'
import { useLocation } from 'react-router-dom'
import Personnes from '../personnes/Personnes'
import Archive from '../archive/Archive'
import Discussion from '../discussion/Discussion'
import Settings from '../settings/Settings'
import Demandes from '../demandes/Demandes'
import Friends from '../friends/Friends'
import UpdateProfile from '../profile/Profile'

const NextSidebar: React.FC = () => {
    const location = useLocation()

    const renderContent = () => {
        switch (location.pathname) {
            case '/discussions':
                return <Discussion />
            case '/personnes':
                return <Personnes />
            case '/archive':
                return <Archive />
            case '/settings':
                return <Settings />
            case '/demandes':
                return <Demandes />
            case '/friends':
                    return <Friends />        
            case '/profile':
                    return <UpdateProfile />                    
            default:
                return <div>Page not found</div>
        }
    }
    if (location.pathname === '/home') {
        return null
    }

    return (
        <div
            id="view"
            className="h-full w-screen flex flex-row dark:bg-gray-700"
        >
            <div
                id="sidebar"
                className="fixed top-4 left-28 rounded-2xl bg-white  dark:bg-gray-800 h-screen md:block shadow-xl px-8 w-30 md:w-80 lg:w-64 overflow-x-hidden transition-transform duration-300 ease-in-out"
            >
                {renderContent()}
            </div>
        </div>
    )
}

export default NextSidebar
