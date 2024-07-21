import axios from 'axios'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { User } from '../interfaces/User'


const getUserInfo = async (id: string): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>(`${API_ENDPOINTS.GET_USER_INFO}/${id}`)
      console.log(response.data)
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

  export default {getUserInfo}