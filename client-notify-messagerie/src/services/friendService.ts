import axios from 'axios'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { ErrorResponse } from '../interfaces'

const fetchFriends  = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_FRIENDS}/${userId}`)
      console.log(response)
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
  export default {fetchFriends}