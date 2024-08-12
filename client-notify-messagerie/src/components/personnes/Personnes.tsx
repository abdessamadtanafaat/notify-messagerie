import { useState } from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { User } from '../../interfaces'
import EnLignePersonnes from './EnLignePersonnes'
import FriendInfoSidebar from './FriendInfoSidebar'
import DiscussionSidebar from './DiscussionSidebar'


export default function Personnes() {
    const { theme } = useThemeContext()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const handleUserClick = (user: User) => {
        setSelectedUser(user)
    }

    return (
        <div className="flex">
            <EnLignePersonnes
                onUserClick={handleUserClick}
                theme={theme}
                />
            {selectedUser && (
                <>

                        <FriendInfoSidebar
                            user={selectedUser}
                        />
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl w-48 md:w-56 lg:w-7/12 xl:w-4/12 overflow-x-hidden">
                        <DiscussionSidebar
                            user={selectedUser}
                            idDiscussion = {idDiscussion}
                        />
                        </div>
                </>
            )}
        </div>
    )
}
