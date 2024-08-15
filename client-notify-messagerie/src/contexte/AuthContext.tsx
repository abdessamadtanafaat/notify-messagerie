import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks'
import { AuthState, setAuthState } from '../store/authSlice'
import { User } from '../interfaces'
import { getCookie } from '../utils/cookieUtils'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'

interface AuthContextProps {
  isAuthenticated: boolean;
  user: AuthState['userInfo'] | null;
  loading: boolean;
  refreshUserData:() => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, userInfo, isLoading } = useAppSelector((state) => state.auth)

  const [loading, setLoading] = useState(true)

  const fetchUserData = async()=> {
    try {
      if(userInfo?.id){
        const response = await axiosInstance.get<User>(`${API_ENDPOINTS.GET_USER_INFO}/${userInfo.id}`)
        const updatedUser = response.data
        console.log(updatedUser) 
        localStorage.setItem('user', JSON.stringify(updatedUser))
        dispatch(setAuthState({
          token: getCookie('token'),
          isAuthenticated: true, 
          userInfo: updatedUser,
        }))
      }
    } catch (err) {
      console.error('Error fetching user data:',err)
    }

  }
  useEffect(() => {
    // Check localStorage for user data on initialization
    const storedUser = localStorage.getItem('user')
    const storedToken = getCookie('token')

    if (storedUser) {
      const user = JSON.parse(storedUser) as User
      dispatch(setAuthState({
        token: storedToken,
        isAuthenticated: true,
        userInfo: user,
      }))
    } else {
      dispatch(setAuthState({
        token: null,
        isAuthenticated: false,
        userInfo: null,
      }))
    }
    setLoading(false)
  }, [dispatch])


  const refreshUserData = async () => {
    await fetchUserData()
  }
  const value = {
    isAuthenticated,
    user: userInfo,
    loading,
    refreshUserData,
  }

  useEffect(() => {
    console.log('AuthProvider values:', { isAuthenticated, userInfo, isLoading })
  }, [isAuthenticated, userInfo, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
