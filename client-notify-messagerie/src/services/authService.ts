import axios from 'axios'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { AuthRequestDto } from '../interfaces/Auth'
import { ErrorResponse } from 'react-router-dom'
import { User, UserStrapiData } from '../interfaces'
import {clearCookies, setCookie } from '../utils/cookieUtils'
import strapiService from './strapiService'



const login = async (authRequest: AuthRequestDto): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(API_ENDPOINTS.LOGIN, authRequest,  {withCredentials: true })
    const existingUser = response.data
    // console.log('Login response:', existingUser)
    const token: string = response.data.token ?? ''
    const refreshToken: string = response.data.refreshToken ?? '' 
    setCookie('token', token, 15)
    setCookie('refreshToken', refreshToken, 7) 
    console.log(response)
    localStorage.setItem('user', JSON.stringify(response.data))

    await synchronizeWithStrapi(existingUser)
    
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const typedError = error.response.data as ErrorResponse
      console.log(typedError)
      throw typedError
    } else {
      throw { error: 'An unknown error occurred', statusCode: 500 }
    }
  }
}

const logout = async (userId: string): Promise<void> => {

  try{
    await axiosInstance.post<void>(API_ENDPOINTS.LOGOUT,userId, { withCredentials: true })
    localStorage.clear()
    clearCookies()
    window.location.href = '/login'


  }catch(error){
    if(axios.isAxiosError(error) && error.response){
      const typedError = error.response.data as ErrorResponse
      console.log(typedError)
      throw typedError
    }else{
      throw {error: 'An unknown error occurred', statusCode: 500}
    }

  }
}

const refreshToken = async (refreshToken: string) => {
  
  try {
  const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN,  refreshToken, { withCredentials: true })
  return response.data

} catch (error) {
  if (axios.isAxiosError(error) && error.response) {
    const typedError = error.response.data as ErrorResponse
    console.log(typedError)
    throw typedError
  } else {
    throw { error: 'An unknown error occurred', statusCode: 500 }
  }
}

}

 const synchronizeWithStrapi = async (existingUser: User): Promise<void> => {

      try {
          const userData: UserStrapiData= {
            idUser: existingUser.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            username: existingUser.username,
            email: existingUser.email,
            password: existingUser.password,
            phoneNumber: existingUser.phoneNumber,
            tokenEmail: existingUser.tokenEmail,
            isEmailVerified: existingUser.isEmailVerified,
            isEmailTokenUsed: existingUser.isEmailTokenUsed,
            isFirstTimeLogin: existingUser.isFirstTimeLogin,
            isPhoneNumberVerified: existingUser.isPhoneNumberVerified,
            isTokenPhoneNumberUsed: existingUser.isTokenPhoneNumberUsed,
            tokenPhone: existingUser.tokenPhone,
            active: existingUser.active,
            refreshToken: existingUser.refreshToken ?? '',
            lastLogin: existingUser.lastLogin,
            lastLogout: existingUser.lastLogout,
            createdAtTime: existingUser.createdAt,
            refreshTokenExpiryTime: existingUser.refreshTokenExpiryTime,
            phoneNumberExpiredAt: existingUser.phoneNumberExpiredAt,
            avatarUrl: existingUser.avatarUrl
          }

          await strapiService.updateUserData(existingUser.email, userData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    

}

export default { login, logout, refreshToken}

