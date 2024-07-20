import axios from 'axios'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { ErrorResponse } from 'react-router-dom'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


const sendSMS = async (phoneNumber: string): Promise<void> => {
    await delay(1000)
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SEND_SMS, null,{
        params: {phoneNumber}
    })
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


  const verifyPhone = async (tokenPhoneNumber: string): Promise<void> => {
  await delay(1000)
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_PHONE, null,{
      params: {tokenPhoneNumber}
  })
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
  export default {
    sendSMS,
    verifyPhone
  }