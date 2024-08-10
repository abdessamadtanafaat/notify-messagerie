import React, { useState } from 'react'
import { User } from '../../interfaces'
import { LockKeyholeIcon, PhoneIcon, UserCircle } from 'lucide-react'
import { HiUserGroup } from 'react-icons/hi'
import { formateDate, formatPhoneNumber, getAvatarUrl } from '../../utils/userUtils'
import { useThemeContext } from '../../contexte/ThemeContext'
import StatusMessage from '../common/StatusMessage'
import userService from '../../services/userService'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexte/AuthContext'
import DeleteFriendComponent from './DeleteFriendComponent'

interface FriendInfoSidebarProps {
    user: User

}

const FriendInfoSidebar: React.FC<FriendInfoSidebarProps> = ({ user }) => {

    const {theme} = useThemeContext()
    const [isFriend, setIsFriend] = useState<boolean>(true)
    const [openPopUp, setOpenPopUp] = useState<boolean>(false)
    const {refreshUserData} = useAuth()

    const handleClosePopUp = () => setOpenPopUp(false)

    const  handleDeleteFriend = async (userId: string, friendId: string) => {
        try{
        //console.log(`Deleting user with ID: ${userId}`)
        const unfriendRequest = { userId, friendId }
        await userService.unfriend(unfriendRequest)
        toast.success(`successfully unfriend ${user.firstName} ${user.lastName}`)
        setIsFriend(false)
        refreshUserData()
        //console.log(response) 
        }catch(err){
            toast.error('Could not unfriend')
        }
    }

    return (
        <div
        >
            <div
                id="sidebar"
                className="fixed top-4 right-6 rounded-2xl bg-white dark:bg-gray-800 h-screen md:block shadow-xl px-6 py-8 w-30 md:w-80 lg:w-80 overflow-x-hidden transition-transform duration-300 ease-in-out"
            >
                <div className="flex flex-col items-center space-y-5">
                    <img
                        src={getAvatarUrl(theme,user ?? {})}
                        alt="Avatar user"
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                    />
                    <p className="font-bold text-dark dark:text-white text-xl">{user.firstName} {user.lastName}</p>
                    <StatusMessage user={user} />
                    <div className="w-full flex items-center space-x-2 justify-center">
                        <HiUserGroup className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{user.about}</p>
                    </div>

                    <div className="w-full flex justify-center mt-4">
                        <div className="bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white rounded-lg px-4 py-2 text-center flex items-center space-x-2">
                            <LockKeyholeIcon className="h-5 w-5" />
                            <p>End-to-end encrypted</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center space-y-4 mt-4">
                        <div className="w-full flex items-center space-x-2 justify-center">
                            <PhoneIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Phone number: {formatPhoneNumber(user.phoneNumber)}</p>
                        </div>
                        <div className="w-full flex items-center space-x-2 justify-center">
                            <HiUserGroup className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Joined {formateDate(user.createdAt)}</p>
                        </div>
                    </div>

                    <div className="w-full flex items-center space-x-2 justify-center">
                        <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm">You have been friends since: mnb3d
                        </p>
                    </div>

                    <div className="w-full space-y-4 flex justify-center mt-4">
                        <button
                            onClick={()=> setOpenPopUp(true)}
                            className={`text-white rounded-lg px-4 py-2
                                         ${isFriend ? 'bg-red-600' : ''} `}
                        >
                            {isFriend ? 'Delete Friend' : ''} 
                        </button>
                    </div>
                </div>
            </div>
            <DeleteFriendComponent openPopUp={openPopUp} closePopUp={handleClosePopUp} user={user} deleteFriend={handleDeleteFriend}/>
        </div>
    )
}

export default FriendInfoSidebar
