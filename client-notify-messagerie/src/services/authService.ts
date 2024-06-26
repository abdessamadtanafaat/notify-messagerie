import axiosInstance from '../api/axiosInstance'
import API_ENDPOINTS from '../api/endpoints'

interface AuthRequestDto {
    emailOrPhoneNumber: string;
    password: string;
}

interface AuthResponseDto {
    token: string;
    refreshToken: string; 
    username: string;
}

const login = async(authRequest: AuthRequestDto): Promise<AuthResponseDto> =>{

    const response = await axiosInstance.post<AuthResponseDto>(API_ENDPOINTS.LOGIN, authRequest) 
    console.log(response.data)
    return response.data 
}

export default {
    login,
} 