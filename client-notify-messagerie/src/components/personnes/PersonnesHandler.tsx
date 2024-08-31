import React, { useEffect, useState } from 'react'
import { User } from '../../interfaces'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { fetchUsersByIds, getUserInfo } from '../../store/userSlice'
import { useAuth } from '../../contexte/AuthContext'

interface PersonnesHandlerProps {
  render: (props: {
    friends: User[];
    loading: boolean
  }) => React.ReactNode
}

export const PersonnesHandler: React.FC<PersonnesHandlerProps> = ({ render }) => {

  const { user } = useAuth()
  const[friends, setFriends] = useState<User[]>([])
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(true)


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const actionResult = await dispatch (getUserInfo(user?.id ?? ''))
        if (getUserInfo.fulfilled.match(actionResult)){
            const friendIds = actionResult.payload.friends
            
            if (friendIds.length > 0) {
              const friendsActionResult = await dispatch(fetchUsersByIds(friendIds))
              if (fetchUsersByIds.fulfilled.match(friendsActionResult)) {
                setFriends(friendsActionResult.payload)
              } else {
                console.error('Failed to fetch friends: ', friendsActionResult.payload)
              }
          }
        }

      }catch(error){
        console.error('Failed to fetch friends: ', error)
      }finally{
        setLoading(false)
      }
    }
    fetchData()
  }, [dispatch, user?.id])
  
  return render({
    friends,
    loading,
  })
}
