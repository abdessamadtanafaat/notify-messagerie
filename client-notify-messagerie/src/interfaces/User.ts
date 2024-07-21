export interface User{

    id : string
    firstName : string
    lastName : string
    username : string
    email : string
    phoneNumber : string
    isEmailVerified : string
    lastLogin : Date
    lastLogout : Date
    createdAt: Date
    active : boolean
    refreshToken : string
    refreshTokenExpiryTime : Date 

    
}