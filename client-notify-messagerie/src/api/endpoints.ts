 const API_ENDPOINTS = {
    LOGIN: '/Auth/login',
    LOGOUT: '/Auth/logout',
    REGISTER: '/Auth/register',
    VERIFY_EMAIL: '/Auth/verify-email',
    SEND_SMS: '/Auth/send-sms',
    VERIFY_PHONE: '/Auth/verify-phone',
    RESET_PASSWORD_BY_PHONE: '/Auth/reset-password-by-phone',
    RESET_PASSWORD_BY_EMAIL: '/Auth/reset-password-by-email',
    RESET_PASSWORD_BY_EMAIL_REQUEST:'/Auth/reset-password-by-email-request',
    REFRESH_TOKEN: '/Auth/refresh-token',
    SEND_SMS_FROM_RESET_PASSWORD:'/Auth/send-sms-from-reset-password',

    // -------------------------------USER ENDPOINTS : ----------------------------------- // 
    GET_USER_INFO: '/User',
    GET_USER_BY_IDS: '/User/byIds',
    GET_USER_AVATAR: 'https://res.cloudinary.com/dhlhmvoez/image/upload/v1680123456/large_WEEEE_Whats_App_Image_2024_06_04_at_20_32_34_1_removebg_1_2fbb0e227b',
    //PUT_AVATAR_URL: '/update-avatar',
    PUT_PROFILE_URL: '/update-profile',
    UNFRIEND: 'User/unfriend',
    SEARCH_USERS_DISCUSSION: 'User/search',
    // ====================================== STRAPI ====================================== // 
    
    USERS: 'n-users',

//==========================MessagesEndpointes===================================//

      GET_MESSAGES: '/Discussions/messages',  // ALL THE DISCUSSIONS OF THE USER 
      SEND_MESSAGE: '/Discussions/send', 
      GET_DISCUSSION: '/Discussions/Discussion', // GET THE DISCUSSION OF THE USERAUTH AND SELECTED USER IN THE BAR CHAT
      UPLOAD_AUDIO: '/Discussions/uploadAudio',
      UPLOAD_FILE: '/Discussions/uploadFile',
//====================WEB SOCKET  =============P=====

      WEBSOCKET_URL: 'ws://localhost:5000/ws' 

 }

 export default API_ENDPOINTS
