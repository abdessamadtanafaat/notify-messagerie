import axios from 'axios'
import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'
import { AuthRequestDto, AuthResponseDto } from '../interfaces/Auth'
import { ErrorResponse } from 'react-router-dom'


const login = async (authRequest: AuthRequestDto): Promise<AuthResponseDto> => {
  try {
    const response = await axiosInstance.post<AuthResponseDto>(API_ENDPOINTS.LOGIN, authRequest)
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

const logout = async (username: string): Promise<void> => {
  try{
    const response = await axiosInstance.post<void>(API_ENDPOINTS.LOGOUT,username)
    console.log(response.data)
  }catch(error){
    if(axios.isAxiosError(error) && error.response){
      const typedError = error.response.data as ErrorResponse
      console.log(typedError)
      throw typedError
    }else{
      throw {error: 'An unknown error occurred', statusCode: 500}
    }

  }
}

export default { login, logout}
