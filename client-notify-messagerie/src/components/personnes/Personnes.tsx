import { useState } from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { User } from '../../interfaces'
import EnLignePersonnes from './EnLignePersonnes'
import FriendInfoSidebar from './FriendInfoSidebar'
import DiscussionSidebar from './DiscussionSidebar'
import { useAuth } from '../../contexte/AuthContext'
import messageService from '../../services/messageService'
import { Message } from 'postcss'


export default function Personnes() {
    const { theme } = useThemeContext()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const { user: userAuth, refreshUserData } = useAuth()

    const [messages, setMessages] = useState<Message[]>([])

    const [idDiscussion, setIdDiscussion] = useState<string>('')


    const handleUserClick = async (user: User) => {
        //console.log('Clicked !')
        try {
            setSelectedUser(user)
            //console.log(user)
            if (userAuth) {
                //console.log(userAuth.id)
                const discussionData = await messageService.getDiscussion(userAuth.id, user.id)
                console.log(discussionData.messages)

                setMessages(discussionData.messages)
                //console.log(messages)
                setIdDiscussion(discussionData.id)
                //console.log(idDiscussion)
            }
            refreshUserData()
        } catch (error) {
            console.log('Failed to fetch messages')
        }
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
                            receiver={selectedUser}
                            idDiscussion={idDiscussion}
                            messages={messages}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
