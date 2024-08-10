import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import registerReducer from './registerSlice'
import verifyEmailReducer from './verifyEmailSlice'
import sendSmsReducer from './sendSmsSlice'
import sendVerificationEmailSlice from './sendVerificationEmailSlice'
import resetPasswordByEmailSlice from './resetPasswordByEmailSlice'
import userSlice from './userSlice'



const store = configureStore({
    // sets  up the Redux store with a reducer : authReducer managing the auth slice of the state.
    reducer: {
        auth: authReducer,
        register: registerReducer,
        verifyEmail: verifyEmailReducer,
        sendSms: sendSmsReducer,
        sendTokenEmail: sendVerificationEmailSlice,
        resetPasswordByEmail: resetPasswordByEmailSlice,
        user: userSlice,
        users: userSlice
    },

})

export type RootState =   ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export default store
