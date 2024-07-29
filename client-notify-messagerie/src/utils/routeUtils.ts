/* eslint-disable no-useless-escape */

export const shouldShowSidebar = (pathname: string): boolean => {


    const showSidebarRoutes = [
        '/test',            
        '/messages',
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