import axios from 'axios'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { Discussion, DoingWithDiscussion, Message } from '../interfaces/Discussion'
import { toast } from 'react-toastify'
import { SearchRequest } from '../interfaces'




  const getDiscussions  = async (userId: string,pageNumber: number, pageSize:number): Promise<Discussion[]> => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_MESSAGES}/${userId}`,{params: {pageNumber, pageSize}})
      //console.log(response)
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
  
  const deleteDiscussion = async (discussionId: string) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_DISCUSSION}/${discussionId}`)
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

  const DoWithDiscussion = async (doingWithDiscussion: DoingWithDiscussion ) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.DO_WITH_DISCUSSION}`, doingWithDiscussion)
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

  const searchUsersByFirstNameOrLastNameOrLastMessageAsync = async (searchRequest:SearchRequest,pageNumber: number, pageSize:number) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SEARCH_DISCUSSIONS ,searchRequest,{params: {pageNumber, pageSize}})
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


  export default {getDiscussions
    ,sendMessage
    ,getDiscussion
    ,deleteDiscussion
    ,DoWithDiscussion
    ,searchUsersByFirstNameOrLastNameOrLastMessageAsync} 

