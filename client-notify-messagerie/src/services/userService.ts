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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export async function uploadFile(file: File, userId: string | null): Promise<any> {

    const preset_key = import.meta.env.VITE_PRESET_KEY
    const cloud_name = import.meta.env.VITE_CLOUD_NAME
 

        const formData = new FormData()
        formData.append('file',file)
        formData.append('upload_preset', preset_key)
        formData.append('cloud_name', cloud_name)

        try {
          const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)
          console.log(response.data.url)
          const avatarUrl = response.data.url 

          await axiosInstance.put(`${API_ENDPOINTS.PUT_AVATAR_URL}/${userId}`,avatarUrl)
          console.log('Avatar URL updated successfully')
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
  


  export default getUserInfo
