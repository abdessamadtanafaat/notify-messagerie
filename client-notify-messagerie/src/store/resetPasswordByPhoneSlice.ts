import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import resetPasswordService from '../services/resetPasswordService'



interface ResetPasswordState{
    isLoading: boolean; 
    error: string | null; 
}

const initialState: ResetPasswordState = {
    isLoading: false,
    error: null,
}

export const resetPassword = createAsyncThunk<
string,
{ tokenPhoneNumber: string, password: string },
  { rejectValue: ErrorResponse }
>('auth/reset-password', async ({tokenPhoneNumber, password}, { rejectWithValue }) => {
  try {
    await resetPasswordService.resetPasswordByPhone(tokenPhoneNumber, password)
    return 'passowrd changed successfully.'
  } catch (error) {
    const err = error as ErrorResponse
    return rejectWithValue(err)
  }
})

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(resetPassword.pending, (state)=>{
            state.isLoading = true
            state.error= null
        })
        .addCase(resetPassword.fulfilled, (state) => {
            state.isLoading = false
        })
        
        .addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload?.error ??'Reset Password failed'
         })
    }
})

export default resetPasswordSlice.reducer
