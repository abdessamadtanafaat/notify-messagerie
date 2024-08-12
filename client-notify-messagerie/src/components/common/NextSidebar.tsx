// import React from 'react'
// import { useLocation } from 'react-router-dom'
// import Personnes from '../personnes/Personnes'
// import Archive from '../archive/Archive'
// import Discussion from '../discussion/Discussion'
// import Settings from '../Settings'
// import Demandes from '../demandes/Demandes'
// import Friends from '../friends/Friends'
// import UpdateProfile from '../profile/Profile'

// const NextSidebar: React.FC = () => {
//     const location = useLocation()

//     const renderContent = () => {
//         switch (location.pathname) {
//             case '/discussions':
//                 return <Discussion />
//             case '/personnes':
//                 return <Personnes />
//             case '/archive':
//                 return <Archive />
//             case '/settings':
//                 return <Settings />
//             case '/demandes':
//                 return <Demandes />
//             case '/friends':
//                 return <Friends />
//             case '/profile':
//                 return <UpdateProfile />
//             default:
//                 return <div>Page not found</div>
//         }
//     }
//     if (location.pathname === '/home') {
//         return null
//     }

//     return (
//         <> {renderContent()}</>
//     )
// }

// export default NextSidebar
