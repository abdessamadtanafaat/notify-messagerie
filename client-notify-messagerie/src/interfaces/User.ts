// Define common properties
export interface CommonUserData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    tokenEmail: string;
    isEmailVerified: boolean;
    isEmailTokenUsed: boolean;
    isFirstTimeLogin: boolean;
    isPhoneNumberVerified: boolean;
    isTokenPhoneNumberUsed: boolean;
    tokenPhone: number;
    active: boolean;
    lastLogin: Date;
    lastLogout: Date;
    refreshToken: string;
    refreshTokenExpiryTime: Date;
    phoneNumberExpiredAt: Date;
    avatarUrl: string;
    about: string; 
    friends: [];
    city: string; 
    work: string; 
    education: string;
    nbFriends: number; 
    nbInvitations: number; 
    nbFriendRequests: number;
  }
  
  // User interface (local database)
  export interface User extends CommonUserData {
    id: string;
    token: string;
    createdAt?: Date;
  }
  
  // UserStrapiData interface (for Strapi API)
  export interface UserStrapiData extends CommonUserData {
    idUser: string;
    createdAtTime?: Date;
  }
  
  
export interface UserDataRegistration {

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;    
}

export interface FormDataRegistration {

    email: string;
    password: string;
    repeatedPassword: string;
    EnteredphoneNumber: string;
    firstName: string;
    lastName: string;  
}

export interface FormDataLogin 
{
    emailOrPhoneNumber: string,
    password: string,
}
export interface FormErrors {
    email: boolean;
    password: boolean;
    repeatedPassword?: boolean;
    EnteredphoneNumber?: boolean;
    firstName?: boolean;
    lastName?: boolean;
}

export interface UpdateProfileReq {
  avatarUrl: string;
  username: string;
  about: string;
}

export interface UnfriendRequest {
  userId: string; 
  friendId: string;
}

export interface SearchRequest {
  userId: string; 
  searchReq: string;
}

