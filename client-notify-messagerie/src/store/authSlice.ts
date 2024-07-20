import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import authService from '../services/authService'
import { AuthRequestDto, AuthResponseDto } from '../interfaces/Auth'
import { ErrorResponse } from '../interfaces/ErrorResponse'


export interface AuthState {
  token: string | null
  username: string | null
  isFirstTimeLogin: string | null
  isLoading: boolean
  error: { error: string; statusCode: number } | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null, 
  isFirstTimeLogin: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),  
}

export const login = createAsyncThunk<
  AuthResponseDto,
  AuthRequestDto,
  { rejectValue: ErrorResponse }
>('auth/login', async (authRequest, { rejectWithValue }) => {
  try {
    const response = await authService.login(authRequest)
    localStorage.setItem('token', response.token)
    localStorage.setItem('username', response.username)

    return response
  } catch (error) {
    return rejectWithValue(error as ErrorResponse)
  }
})

export const logout = createAsyncThunk<
  void,
  void,
  {rejectValue: ErrorResponse}
>('auth/logout',
  async (_, { getState, rejectWithValue })=> {

    const state = getState() as {auth: AuthState}
    const username = state.auth.username
    console.log(username)


    if (!username) {
      console.log(username)
      return rejectWithValue ({error: 'Username is not available', statusCode: 400})
    }

    try { 
           console.log(username)
      await authService.logout(username)
    }catch(error){
      return rejectWithValue(error as ErrorResponse)
    }
  }



)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: (state) => {

    //   localStorage.removeItem('token')
    //   state.token = null
    //   state.username = null
    //   state.isAuthenticated = false
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.isAuthenticated = false 
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.username = action.payload.username
        state.isFirstTimeLogin = action.payload.isFirstTimeLogin
        state.isAuthenticated = true  
        state.isLoading = false
      })
      .addCase(login.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.isLoading = false
        state.error = action.payload ?? { error: 'Failed to login', statusCode: 0 }
      })
      .addCase(logout.pending, (state)=> {
        state.isLoading = true        
      })
      .addCase(logout.fulfilled ,(state)=>{
        state.token = null
        state.username = null
        state.isLoading = false
        state.isAuthenticated = false
        localStorage.removeItem('token')
        localStorage.removeItem('username')

      })
      .addCase(logout.rejected, (state, action: PayloadAction<ErrorResponse  | undefined> ) => {
        state.isLoading = false
        state.error = action.payload ?? { error: 'Failed to logout', statusCode: 0}
      })
  },
})

// export const { logout } = authSlice.actions
export default authSlice.reducer
