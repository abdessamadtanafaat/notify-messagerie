/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { User } from '../../interfaces'
import { DiscussionHandler } from './DiscussionHandler'
import { useAuth } from '../../contexte/AuthContext'
import DiscussionSidebarSkeleton from './DiscussionSidebarSkeleton'
import FriendInfoSidebar from '../personnes/FriendInfoSidebar'
import HeaderDiscussion from './HeaderDiscussion'
import useFetchMessages from './useFetchMessages'
import ChatComponent from './ChatComponent'


interface DiscussionSidebarProps {
    receiver: User
    idDiscussion: string
}

const DiscussionSidebar: React.FC<DiscussionSidebarProps> = ({ receiver, idDiscussion }) => {
    const { user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const toggleSidebar = () => { setSidebarOpen(prevState => !prevState) }
    const { messages: fetchedMessages, loading, fetchMessages } = useFetchMessages({ user, receiver, idDiscussion })


    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])


    
    return (
        <>
            {loading ? (
                <DiscussionSidebarSkeleton />
            ) : (
                <DiscussionHandler
                    render={({
                        typingUser, seenUser, 
                        seenNotif, recordingAudio, 
                    }) => (
                        <>
                            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-[calc(100%-300px)]' : 'w-full'} relative`}>

                                <HeaderDiscussion
                                    receiver={receiver}
                                    toggleSidebar={toggleSidebar}
                                    typingUser={typingUser}
                                    recordingAudio={recordingAudio}
                                />
                                
                                <ChatComponent
                                    receiver={receiver}
                                    idDiscussion={idDiscussion}
                                    typingUser={typingUser}
                                    seenUser={seenUser}
                                    seenNotif={seenNotif}
                                />
                                {/* Friend Info Sidebar */}
                                {sidebarOpen && (
                                    <div className="w-1/3 min-w-[300px] border-l border-gray-300 dark:border-gray-700">
                                        <FriendInfoSidebar
                                            user={receiver} />
                                    </div>
                                )}
                            </div>

                        </>
                    )}
                                    />

            )}
        </>
    )
}

export default DiscussionSidebar
