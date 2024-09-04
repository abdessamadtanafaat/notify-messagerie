import axios from 'axios'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { ErrorResponse, User } from '../interfaces'
import { AnswerInvitationRequest, InvitationsFriends, MyFriends } from '../interfaces/MyFriends'

const fetchFriends  = async (userId: string, pageNumber: number, pageSize:number): Promise<MyFriends[]> => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_FRIENDS}/${userId}`,{params: {pageNumber, pageSize}})
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


  const fetchInvitations  = async (userId: string, pageNumber: number, pageSize:number): Promise<InvitationsFriends[]> => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_INVITATIONS}/${userId}`,{params: {pageNumber, pageSize}})
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

  const fetchCommonFriends = async (userId: string, friendId: string): Promise<User[]> => {
    try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_COMMON_FRIENDS}?userId=${userId}&friendId=${friendId}`)
        //console.log(response)
        //console.log(response.data)
        return response.data
    }catch(error) {
        if (axios.isAxiosError(error) && error.response) {
            const typedError = error.response.data as ErrorResponse
            console.log(typedError)
            throw typedError
    }else {
        throw {error: 'An error occurred', statusCode: 500}
    }
  }
}

const inswerInvitation  = async (answerInvitationRequest: AnswerInvitationRequest) => {
  try {
    console.log(answerInvitationRequest)
    const response = await axiosInstance.post(`${API_ENDPOINTS.INSWER_INVITATION}`, answerInvitationRequest)
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



  export default {fetchFriends,fetchCommonFriends,fetchInvitations,inswerInvitation}