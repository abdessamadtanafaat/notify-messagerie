import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ErrorResponse } from '../interfaces/ErrorResponse'
import { UpdateProfileReq, User } from '../interfaces'
import userService from '../services/userService'


export interface UserState {
    user: User | null 
    avatarUrl: string | null,
    status: string | null,
    error: { error: string; statusCode: number } | null
}

const initialState: UserState = {
    user: null,
    avatarUrl: null,
    status: null,
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

export const fetchImage = createAsyncThunk(
  'image/fetchImage',
   async(publicId: string) => {
    const response = await userService.getUserInfo(publicId)
    return response.data.secure_url
   }
)

export const updateProfile = createAsyncThunk<
void,
{id: string; updateProfileReq: UpdateProfileReq},
{ rejectValue: ErrorResponse }
>(
  'update-profile',
   async({id, updateProfileReq}, { rejectWithValue }) => {
    try {
      await userService.updateUserInfo(id, updateProfileReq)
    } catch (error) {
      return rejectWithValue(error as ErrorResponse)
    }

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
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.status = 'rejected'
        state.error = action.payload ?? { error: 'Failed to display user', statusCode: 0 }
      })
  },
})

export default userSlice.reducer
