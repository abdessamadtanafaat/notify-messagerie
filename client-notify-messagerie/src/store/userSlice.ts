import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import { User } from '../interfaces'
import userService from '../services/userService'


export interface UserState {
    user: User | null 
    avatarUrl: string | null,
    error: { error: string; statusCode: number } | null
}

const initialState: UserState = {
    user: null,
    avatarUrl: null,
    error: null,
}

export const getUserInfo = createAsyncThunk<
  User,
  string,
  { rejectValue: ErrorResponse }
>('user/getUserInfo', async (id, { rejectWithValue }) => {
  try {
    const response = await userService(id)
    console.log(response)

    return response
  } catch (error) {
    return rejectWithValue(error as ErrorResponse)
  }
})

export const fetchImage = createAsyncThunk(
  'image/fetchImage',
   async(publicId: string) => {
    const response = await userService(publicId)
    return response.data.secure_url
   }
)

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
      .addCase(fetchImage.pending, (state) => {
        state.error = null
      })
      .addCase(fetchImage.fulfilled, (state, action) => {
        state.avatarUrl = action.payload
      })

  },
})

export default userSlice.reducer
