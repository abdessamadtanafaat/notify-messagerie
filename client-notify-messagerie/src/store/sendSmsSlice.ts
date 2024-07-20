import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import smsService from '../services/smsService'



interface SendSmsState{
    isLoading: boolean; 
    error: string | null; 
}

const initialState: SendSmsState = {
    isLoading: false,
    error: null,
}

export const sendSms = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>('auth/send-sms', async (phoneNumber, { rejectWithValue }) => {
  try {
    await smsService.sendSMS(phoneNumber)
    return 'Sent it successful. Please check your phone for login token.'
  } catch (error) {
    const err = error as ErrorResponse
    return rejectWithValue(err)
  }
})

export const verifyPhone = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorResponse }
>('auth/verify-phone', async (tokenPhoneNumber, { rejectWithValue }) => {
    try {
      await smsService.verifyPhone(tokenPhoneNumber)
      return 'Verification successful'
    } catch (error) {
      const err = error as ErrorResponse
      return rejectWithValue(err)
    }
  }
)

const sendSmsSlice = createSlice({
    name: 'sendSms',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(sendSms.pending, (state)=>{
            state.isLoading = true
            state.error= null

        })
        .addCase(sendSms.fulfilled, (state) => {
            state.isLoading = false
        })
        
        .addCase(sendSms.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload?.error ??'Sending failed'
         })
         .addCase(verifyPhone.pending, (state) => {
          state.isLoading = true
          state.error = null
        })
        .addCase(verifyPhone.fulfilled, (state) => {
          state.isLoading = false
        })
        .addCase(verifyPhone.rejected, (state, action) => {
          state.isLoading = false
          state.error = action.payload?.error ??'Verifing failed'
        })
    }
  })


export default sendSmsSlice.reducer
