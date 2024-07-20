import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import SmsService from '../services/smsService'



interface RegisterState{
    isLoading: boolean; 
    error: string | null; 
}

const initialState: RegisterState = {
    isLoading: false,
    error: null,
}

export const register = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>('auth/send-sms', async (phoneNumber, { rejectWithValue }) => {
  try {
    await SmsService.sendSMS(phoneNumber)
    return 'Please check your phone for login.'
  } catch (error) {
    const err = error as ErrorResponse
    return rejectWithValue(err)
  }
})

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state)=>{
            state.isLoading = true
            state.error= null
        })
        .addCase(register.fulfilled, (state) => {
            state.isLoading = false
        })
        
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload?.error ??'Complete Profile failed'
         })
    }
})

export default registerSlice.reducer
