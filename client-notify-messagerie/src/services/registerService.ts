import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { RegisterRequestDto } from '../interfaces/Auth'
import { ErrorResponse } from '../interfaces/ErrorResponse'


const register = async(registerRequest: RegisterRequestDto): Promise<void> =>{

  try {
    await axiosInstance.post(API_ENDPOINTS.REGISTER, registerRequest)
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

export default {register} 