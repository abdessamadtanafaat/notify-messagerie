import React, { useEffect, useState } from 'react'
import { User } from '../../interfaces'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'


const Friends:  React.FC = () => {

    const { user, refreshUserData } = useAuth()
    const [loading, setIsLoading] = useState<boolean>(true)
    const [friends, setFriends] = useState<User[]>([])

    const fetchFriends = async () => {
        try {
            if(user){
                const friends = await friendService.fetchFriends(user.id)
                setFriends(friends)
                console.log(friends)
            }

        }catch  (err) {
            console.log(err)
        }finally {
            setIsLoading(false)
        }
    }
    useEffect (()=> {
                fetchFriends()
    },[])

    const friendsList = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
        { id: 3, firstName: 'Emily', lastName: 'Jones' },
        { id: 4, firstName: 'Michael', lastName: 'Brown' },
        { id: 5, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 6, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 7, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 8, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 9, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 10, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 11, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 12, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 13, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 14, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 15, firstName: 'Scofiled', lastName: 'RAGNAR' },
        { id: 16, firstName: 'Scofiled', lastName: 'RAGNAR' },

        // Add more friends as needed
      ]

      

    return (
        // <FriendsHandler
        //     render={({ }) => (
<div className="flex h-screen pl-16">
    <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800 overflow-y-auto">
        <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white mb-6">
            Friends
        </h1>
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
            {friendsList.map(friend => (

            <li key={friend.id} className="h-32 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700">
                <p className="text-center">{friend.firstName} {friend.lastName}</p>
            </li>
            ))}

        </ul>
        
    </div>
</div>

)
}

export default Friends


