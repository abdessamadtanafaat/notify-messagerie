import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import { User } from '../interfaces'
import userService from '../services/userService'


export interface UserState {
    user: User | null 
    error: { error: string; statusCode: number } | null
}

const initialState: UserState = {
    user: null,
    error: null,
}

export const getUserInfo = createAsyncThunk<
  User,
  string,
  { rejectValue: ErrorResponse }
>('user/getUserInfo', async (id, { rejectWithValue }) => {
  try {
    const response = await userService.getUserInfo(id)
    console.log(response)

    return response
  } catch (error) {
    return rejectWithValue(error as ErrorResponse)
  }
})


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.error = null
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload 
      })
      .addCase(getUserInfo.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.error = action.payload ?? { error: 'Failed to display user', statusCode: 0 }
      })
  },
})

export default userSlice.reducer
