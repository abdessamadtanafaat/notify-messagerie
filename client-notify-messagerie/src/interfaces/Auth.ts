export interface AuthRequestDto {
    emailOrPhoneNumber: string;
    password: string;
  }
  
  export interface AuthResponseDto {
    token: string;
    id: string;
    refreshToken: string;
    username: string;
    isFirstTimeLogin: string;
  }
  
  export interface RegisterRequestDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }
  
  export interface DecodedToken {
    email: string
    name: string;
    picture: string;
  }
