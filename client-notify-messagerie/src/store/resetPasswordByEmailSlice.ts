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

export const resetPasswordByEmail = createAsyncThunk<
string,
{ tokenEmail: string, password: string },
  { rejectValue: ErrorResponse }
>('auth/reset-password', async ({tokenEmail, password}, { rejectWithValue }) => {
  try {
    await resetPasswordService.resetPasswordByEmail(tokenEmail, password)
    return 'passowrd changed successfully.'
  } catch (error) {
    const err = error as ErrorResponse
    return rejectWithValue(err)
  }
})

const resetPasswordSlice = createSlice({
    name: 'resetPasswordByEmail',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(resetPasswordByEmail.pending, (state)=>{
            state.isLoading = true
            state.error= null
        })
        .addCase(resetPasswordByEmail.fulfilled, (state) => {
            state.isLoading = false
        })
        
        .addCase(resetPasswordByEmail.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload?.error ??'Reset Password failed'
         })
    }
})

export default resetPasswordSlice.reducer
