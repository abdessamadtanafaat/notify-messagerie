import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RegisterRequestDto } from '../interfaces'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import registerService from '../services/registerService'



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
  RegisterRequestDto,
  { rejectValue: ErrorResponse }
>('auth/register', async (registerRequest, { rejectWithValue }) => {
  try {
    await registerService.register(registerRequest)
    return 'Registration successful. Please check your email for login token.'
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
            state.error = action.payload?.error ??'Registration failed'
         })
    }
})

export default registerSlice.reducer
