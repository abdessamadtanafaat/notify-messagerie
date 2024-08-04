import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import verifyEmailService from '../services/EmailService'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import { RootState } from './store'

interface VerifyEmailState {
  isLoading: boolean;
  error: string | null;
  isVerified: boolean;
}

const initialState: VerifyEmailState = {
  isLoading: false,
  error: null,
  isVerified: false,
}

export const verifyEmail = createAsyncThunk<
  void,
  string,
  { rejectValue: ErrorResponse }
>('auth/verifyEmail', async (tokenEmail, { rejectWithValue }) => {
  try {
    await verifyEmailService.verifyEmail(tokenEmail)        
    } catch (error) {
    const err = error as ErrorResponse
    return rejectWithValue(err)
  }
})

const verifyEmailSlice = createSlice({
  name: 'verifyEmail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.isVerified = false
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
        state.isVerified = true
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.error ??  'Verification failed.'
        state.isVerified = false
      })
  },
})

export const selectVerifyEmailState = (state: RootState) => state.verifyEmail
export default verifyEmailSlice.reducer
