import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService from '../services/authService'
import { AuthRequestDto } from '../interfaces/Auth'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import { User } from '../interfaces'
export interface AuthState {
  isLoading: boolean;
  error: { error: string; statusCode: number } | null;
  isAuthenticated: boolean;
  userInfo: User | null
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
  userInfo: null 
}

// Define async thunk for login
export const login = createAsyncThunk<User, AuthRequestDto, { rejectValue: ErrorResponse }>(
  'auth/login',
  async (authRequest, { rejectWithValue }) => {
    try {
      const response: User = await authService.login(authRequest)
      return response
    } catch (error) {
      return rejectWithValue(error as ErrorResponse)
    }
  }
)

// Define async thunk for logout
export const logout = createAsyncThunk<void, {userId: string}, { rejectValue: ErrorResponse }>(
  'auth/logout',
  async ({userId}, {rejectWithValue }) => {

    try {
      await authService.logout(userId)
      console.log(userId)
    } catch (error) {
      return rejectWithValue(error as ErrorResponse)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set authentication state
    setAuthState: (state, action: PayloadAction<{ token: string | null; isAuthenticated: boolean, userInfo: User | null}>) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.userInfo = action.payload.userInfo 
    },
    // Action to clear authentication state
    clearAuthState: (state) => {
      state.isAuthenticated = false
      state.userInfo = null 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.isAuthenticated = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userInfo = action.payload
        state.isLoading = false
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.isLoading = false
        state.error = action.payload ?? { error: 'Failed to login', statusCode: 0 }
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.userInfo = null
      })
      .addCase(logout.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.isLoading = false
        state.error = action.payload ?? { error: 'Failed to logout', statusCode: 0 }
      })
  }
})

export const { setAuthState, clearAuthState } = authSlice.actions

export default authSlice.reducer
