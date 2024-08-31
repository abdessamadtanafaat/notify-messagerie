import { useState } from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { User } from '../../interfaces'
import EnLignePersonnes from './EnLignePersonnes'
import DiscussionSidebar from '../discussion/DiscussionSidebar'
import { useAuth } from '../../contexte/AuthContext'
import messageService from '../../services/messageService'
import { useWebSocket } from '../../hooks/webSocketHook'
import WelcomeMessage from '../common/WelcomeMessage'
import { Message } from '../../interfaces/Discussion'


export default function Personnes() {
    const { theme } = useThemeContext()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const { user: userAuth, refreshUserData } = useAuth()

    const [messages, setMessages] = useState<Message[]>([])

    const [idDiscussion, setIdDiscussion] = useState<string>('')
    const {sendSeenNotification } = useWebSocket(userAuth)


    const handleUserClick = async (user: User) => {
        try {
            setSelectedUser(user)
            if (userAuth) {
                const discussionData = await messageService.getDiscussion(userAuth.id, user.id)
                console.log(discussionData)
                setMessages(discussionData.messages)
                setIdDiscussion(discussionData.id)
                const lastMessage = messages[messages.length - 1]
                console.log(lastMessage)                
                if(!lastMessage.read) {
                    sendSeenNotification(lastMessage.id, lastMessage.discussionId, user)
                    console.log('dazt')
                } else {
                    console.log('already read.')
                }
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
                    {/* <FriendInfoSidebar
                        user={selectedUser}
                    /> */}
                    <div className="flex-grow rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl ml-4 lg:ml-6">
                        <DiscussionSidebar
                            receiver={selectedUser}
                            idDiscussion={idDiscussion}
                            messages={messages}
                        />
                    </div>
                </>
            )}
{!selectedUser && <WelcomeMessage/>}
        </div>
    )
}
