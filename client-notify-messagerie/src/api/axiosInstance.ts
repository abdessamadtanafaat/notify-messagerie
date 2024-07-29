import axios from 'axios'
import authService from '../services/authService'
import { getCookie, setCookie } from '../utils/cookieUtils'

const token = getCookie('token')
console.log(`Token: ${token}`) 

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Include cookies in requests
})

axiosInstance.interceptors.request.use(
   (config) => {
    const token = getCookie('token')

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`

  }

  return config
}, error => {
  console.error('Request error:', error)
  return Promise.reject(error)
})

axiosInstance.interceptors.response.use(

(response) => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        //const refreshToken = localStorage.getItem('refreshToken')
        const refreshToken = getCookie('refreshToken')
        console.log(refreshToken)
        console.log('hello from axios 3')

        if (refreshToken) {
          const response = await authService.refreshToken(refreshToken)
          const token = response.jwtToken
          console.log(token)
          setCookie('token', token, 15)
          console.log('rak tlebti refresh token')
          originalRequest.headers.Authorization = `Bearer ${token}`

          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    console.error('Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
