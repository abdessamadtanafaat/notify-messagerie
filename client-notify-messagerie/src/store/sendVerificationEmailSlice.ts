import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import EmailService from '../services/EmailService'



interface SendEmailState{
    isLoading: boolean; 
    error: string | null; 
}

const initialState: SendEmailState = {
    isLoading: false,
    error: null,
}

export const sendTokenEmail = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>('auth/reset-password-by-email', async (email, { rejectWithValue }) => {
  try {
    await EmailService.sendTokenEmail(email)
    return 'Sent it successful. Please check your email for login token.'
  } catch (error) {
    const err = error as ErrorResponse
    return rejectWithValue(err)
  }
})


const sendEmailSlice = createSlice({
    name: 'sendTokenEmail',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(sendTokenEmail.pending, (state)=>{
            state.isLoading = true
            state.error= null

        })
        .addCase(sendTokenEmail.fulfilled, (state) => {
            state.isLoading = false
        })
        
        .addCase(sendTokenEmail.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload?.error ??'Sending failed'
         })
    }
  })


export default sendEmailSlice.reducer
