import React, { useCallback } from 'react'
import userService from '../services/userService'
import { Action } from '../components/friends/FriendsReducer'
import { User } from '../interfaces'


interface UserSearchFriendParams{
    user: User | null
    dispatch: React.Dispatch<Action>
}
export const useSearchUsers=({user, dispatch}: UserSearchFriendParams) =>  {

            const searchUsers  = useCallback (
                    async (userId: string, searchReq: string)   =>{
                        if (user) {
                            try{
                                const searchRequest = { userId, searchReq }
                                const response = await userService.searchUsersByFirstNameOrLastName(searchRequest)
                                dispatch({ type: 'SET_USERS_SEARCH', payload: response })
                            }catch(error){
                                console.error('Failed to fetch users.')
                                dispatch({ type: 'SET_USERS_SEARCH', payload: [] })
                            }
                            finally {
                                dispatch({ type: 'SET_LOADING', payload: false })
                            }
                        }
                         else {
                            dispatch({ type: 'SET_USERS_SEARCH', payload: [] })
                        }
                    },
                    [user, dispatch]
            )
            return {searchUsers}
    }
    


