/* eslint-disable no-useless-escape */

export const shouldShowSidebar = (pathname: string): boolean => {


    const showSidebarRoutes = [
        '/test',            
        '/home',
        '/discussions',
        '/personnes',
        '/archive',
        '/settings',
        '/demandes',
        '/friends',
        '/profile',
    ]
    if (showSidebarRoutes.some(route => pathname === route)) {
        return true
    }

    const dynamicRoutes = [
        /^\/verify-identity\/[^\/]+$/, // Matches /verify-identity/:tokenEmail
        /^\/reset-password\/[^\/]+$/   // Matches /reset-password/:tokenEmai
    ]

    if (dynamicRoutes.some(regex => regex.test(pathname))) {
        return false
    }
    return false
}