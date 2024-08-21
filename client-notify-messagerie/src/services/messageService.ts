import axios from 'axios'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { Message } from '../interfaces/Discussion'
import { toast } from 'react-toastify'



  const getDiscussions  = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_MESSAGES}/${userId}`)
      //console.log(response)
      //console.log(response.data)
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

  const getDiscussion = async (userId: string, selectedUserId: string, cursor?: Date) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_DISCUSSION}/${userId}/${selectedUserId}`, {
        params: {
          cursor: cursor ? cursor.toISOString() : undefined,
          limit: 10
        }
      })
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
  

  const sendMessage = async(message: Message): Promise<void> =>{

    try {
      await axiosInstance.post(API_ENDPOINTS.SEND_MESSAGE, message)
    } catch (error) {
      const typedError = error as { response: { data: ErrorResponse } }
      if (typedError.response && typedError.response.data) {
        toast.error(typedError.response.data.error)
        console.log(typedError)
        throw typedError.response.data
      } else {
        const unexpectedError = 'An unexpected error occurred. Please try again later.'
        toast.error(unexpectedError)
        throw new Error(unexpectedError)
      }
    }
  }

  export default {getDiscussions,sendMessage,getDiscussion}

