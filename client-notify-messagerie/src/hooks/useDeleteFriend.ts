
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { User } from '../interfaces'
import { Action } from '../components/friends/FriendsReducer'
import userService from '../services/userService'

interface UseDeleteFriendParams {
  user: User | null; // Replace `any` with the appropriate user type if available
  dispatch: React.Dispatch<Action>;
  selectedFriend: User | null; // Replace `any` with the appropriate friend type if available
}

const useDeleteFriend = ({ user, dispatch, selectedFriend }: UseDeleteFriendParams) => {
  const deleteFriend = useCallback(
    async (userId: string, friendId: string) => {
      if (selectedFriend) {
        try {
          if (user) {
            const unfriendRequest = { userId, friendId }
            await userService.unfriend(unfriendRequest)
            
            // Uncomment and use this if needed:
             toast.success(`Successfully unfriended ${friendId} ${friendId}`)

            // Perform necessary actions after unfriending
            dispatch({ type: 'REMOVE_FRIEND', payload: friendId })
          }
        } catch (err) {
          toast.error('Could not unfriend')
        } finally {
          dispatch({ type: 'TOGGLE_POPUP', payload: false })
        }
      }
    },
    [user, dispatch, selectedFriend]
  )

  return { deleteFriend }
}

export default useDeleteFriend
