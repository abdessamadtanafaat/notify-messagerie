export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const cookie = parts.pop()?.split(';').shift() || null
      return cookie
    }
    return null
  }
  
  export const setCookie = (name: string, value: string, expiresInMinutes: number) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + (expiresInMinutes * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`
  }
  
  export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }

  export const clearCookies =() => {
    deleteCookie('refreshToken')
    deleteCookie('token')
  }

  export const isTokenValid =():boolean => {
    const refreshToken = getCookie('refreshToken')

    if (!refreshToken){
      return false
    }

    return true
  }