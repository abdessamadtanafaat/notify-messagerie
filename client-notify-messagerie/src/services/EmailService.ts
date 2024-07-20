import axios from 'axios'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { toast } from 'react-toastify'
import { ErrorResponse } from '../interfaces/ErrorResponse'


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const sendTokenEmail = async(email: string): Promise<void> =>{
  try {
    await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD_BY_EMAIL_REQUEST, null,{
      params: {email}
    })
    //return ' successful.'
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

const verifyEmail = async (tokenEmail: string): Promise<void> => {
  await delay(1000)
try {
  const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, null,{
      params: {tokenEmail}
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



export default { verifyEmail,sendTokenEmail }
