import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { ErrorResponse } from '../interfaces/ErrorResponse'


const resetPasswordByPhone = async(tokenPhoneNumber: string, password: string): Promise<void> =>{
  try {
    await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD_BY_PHONE, { tokenPhoneNumber, password })
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

const resetPasswordByEmail = async(tokenEmail: string, password: string): Promise<void> =>{
    try {
      await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD_BY_EMAIL,{ tokenEmail, password })
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

export default {resetPasswordByPhone,resetPasswordByEmail} 