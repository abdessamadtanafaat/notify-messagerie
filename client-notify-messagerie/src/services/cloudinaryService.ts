import axios from 'axios'
//import axiosInstance from '../api/axiosInstance'
import { ErrorResponse } from '../interfaces'
import API_ENDPOINTS from '../api/endpoints'
import axiosInstance from '../api/axiosInstance'

const cloudinaryService =  {
     uploadAudioFile:  async (file: Blob): Promise<string> => {

        try{
      const formData = new FormData()
      formData.append('file', file, 'audio.wav')

      const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD_AUDIO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      })

      return response.data.secure_url 


        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const typedError = error.response.data as ErrorResponse
                console.log(typedError)
                throw typedError
    
            } else {
                throw { error: 'failed to updload the audio file', statusCode: 500 }
            }
        }
    

    },

    uploadFile:  async (file: Blob): Promise<string> => {

        try{
      const formData = new FormData()
      formData.append('file', file,)

      const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD_FILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      })

      return response.data.secure_url 


        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const typedError = error.response.data as ErrorResponse
                console.log(typedError)
                throw typedError
    
            } else {
                throw { error: 'failed to updload the image file', statusCode: 500 }
            }
        }
    

    }

}
export default cloudinaryService