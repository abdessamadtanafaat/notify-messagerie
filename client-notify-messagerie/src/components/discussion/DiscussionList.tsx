import React, { useEffect, useState } from 'react'
//import DiscussionSidebar from '../personnes/DiscussionSidebar'
import { User } from '../../interfaces'
import { SearchIcon } from 'lucide-react'
import { useAuth } from '../../contexte/AuthContext'
import { Discussion } from '../../interfaces/Discussion'

import messageService from '../../services/messageService'
import DiscussionSidebar from '../personnes/DiscussionSidebar'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl } from '../../utils/userUtils'

const DiscussionList: React.FC = () => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [discussions, setDiscussions] = useState<Discussion[]>([])
    const [idDiscussion, setIdDiscussion] = useState<string>('')

    const { theme } = useThemeContext()
    const { user } = useAuth()
    const handleUserClick = (receiver: User, idDiscussion: string) => {
        setSelectedUser(receiver)
        setIdDiscussion(idDiscussion)
        console.log(receiver)
    }

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (user) {
                    console.log(user.id)
                    const discussionsData = await messageService.getDiscussions(user.id)
                    setDiscussions(discussionsData)
                    console.log(discussionsData)
                }
            } catch (error) {
                console.log('Failed to fetch messages')
            }
        }
        fetchMessages()
    }, [user])

    return (
        <div className="flex">
            <div className={'absolute top-4 left-20 md:w-80 lg:w-72 flex-shrink-0 rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl px-4 md:px-8 overflow-y-auto'}>

                <div className="space-y-4 md:space-y-3 mt-5">
                    <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white">
                        Discussion
                    </h1>
                    <div className='relative flex-grow'>
                        <input
                            type='text'
                            name='message'
                            placeholder='Search'
                            // value={message}
                            // onChange={(e) => handleChange('message', e.target.value)}
                            autoFocus={true}
                            className='w-full h-10 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                        />
                        <SearchIcon
                            className='w-4 h-4 text-blue-600 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                        />
                    </div>
                    <ul className="list-none flex flex-col space-y-2">
                        {discussions.map((discussion) => {

                            const {
                                id,
                                lastMessage,
                                receiver
                            } = discussion

                            return (
                                <li
                                    key={id}
                                    className="flex flex-col space-y-1 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                                    onClick={()=> handleUserClick(receiver,id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                // src={receiver.avatarUrl}
                                                src={getAvatarUrl(theme, receiver ?? {})}
                                                alt={`Avatar ${receiver.firstName}`}
                                                className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                            />
                                            <div
                                                className={` absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${discussion.receiver.active ? 'bg-green-500' : 'bg-red-500'}  `}
                                                style={{ transform: 'translate(25%, 25%)' }}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="font-semibold truncate text-xs text-dark dark:text-white">
                                                {receiver.firstName} {receiver.lastName}
                                            </p>
                                            <div className="flex items-center space-x-2 text-xs text-black dark:text-white">
                                                <p className={` truncate ${!lastMessage.read ? 'font-bold' : 'font-normal'} `}>{lastMessage.content}</p>
                                                <p className='text-[12px]'>
                                                    {new Date(lastMessage.timestamp).toLocaleTimeString()} {/* Format timestamp */}
                                                </p>
                                                {!lastMessage.read && (
                                                    <div className="relative">
                                                        <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            {selectedUser && (
                <div className="absolute top-4 left-96 rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl w-48 md:w-56 lg:w-7/12 xl:w-3/5 overflow-x-hidden">
                    <DiscussionSidebar 
                        receiver={selectedUser}
                        idDiscussion={idDiscussion}
                    />
                </div>
            )}
        </div>

    )


}
export default DiscussionList