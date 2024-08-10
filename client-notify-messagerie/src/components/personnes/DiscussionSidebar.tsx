


import React, { useState } from 'react'
import { User } from '../../interfaces'
import { CircleEllipsis, FileIcon, ImageIcon, LockKeyholeIcon, Mic, Phone, SendIcon, Smile, Video } from 'lucide-react'
import StatusMessage from '../common/StatusMessage'
import { getAvatarUrl } from '../../utils/userUtils'
import { useThemeContext } from '../../contexte/ThemeContext'
import data, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { DiscussionHandler } from '../discussion/DiscussionHandler'

interface DiscussionSidebarProps {
    user: User

}


const DiscussionSidebar: React.FC<DiscussionSidebarProps> = ({ user }) => {

    const [isExpanded, setIsExpanded] = useState(false)
    const toggleSidebar = () => setIsExpanded(!isExpanded)
    const { theme } = useThemeContext()

    return (
        <DiscussionHandler
            render={({
                handleChange,
                message,
                showEmojiPicker,
                togglePicker,
                addEmoji,
                setPickerRef,
                SendImage,
                SendFile,
                handleSend,

            }) => (
                    <div
                        id="sidebar"
                        className="fixed top-4 right-96 rounded-2xl bg-white dark:bg-gray-800 h-screen md:block shadow-xl w-48 md:w-56 lg:w-5/12 overflow-x-hidden transition-transform duration-300 ease-in-out"
                    >
                        {/* Header Rectangle */}
                        <div className="w-full h-14 bg-white dark:bg-gray-800 rounded-lg mt-2 shadow-md">
                            <div className="flex items-center justify-between px-5">
                                <div className="flex space-x-4">
                                    <div className="relative">
                                        <img
                                            src={getAvatarUrl(theme, user ?? {})}
                                            alt="Avatar user"
                                            className="w-24 h-24 md:w-12 md:h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                                        />
                                        <div
                                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${user.active == true ? 'bg-green-500' : 'bg-red-500 '}`}
                                            style={{ transform: 'translate(0%, 0%)' }}

                                        />
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <p className="font-bold text-dark dark:text-white text-xl">{user.firstName} {user.lastName}</p>
                                        <StatusMessage user={user} />
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <Video className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <Phone className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <CircleEllipsis className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Message */}
                        <div className="flex flex-col items-center space-y-3 mb-4 mt-12">
                            <img
                                src={getAvatarUrl(theme, user ?? {})}
                                alt="Avatar user"
                                className="w-24 h-24 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                            />
                            <p className="font-extrabold text-dark dark:text-white text-xl">{user.firstName} {user.lastName}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm text-left">
                                You are friends on NotifyAsServie </p>
                        </div>

                        <div className="flex items-center justify-center space-x-2 mt-56">
                            <LockKeyholeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400 text-sm text-left">
                                messages and calls are secure with end-to-end encryption.                    </p>
                        </div>
                        {/* Input Area */}
                        <div className='flex items-center justify-center space-x-2 mt-5'>
                            <div className='flex items-centerspace-x-4 px-5'>
                                <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={SendImage}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <ImageIcon className='w-6 h-6 text-blue-600 dark:text-gray-400 dark:hover:text-white' />
                                </label>
                                <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={SendFile}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />                                <FileIcon className='w-6 h-6 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                </label>
                            </div>
                            {/* Input Area */}
                            <div className='relative flex-grow'>
                                <input
                                    type='text'
                                    name='message'
                                    placeholder='Type a message...'
                                    value={message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                    autoFocus={true}
                                    className='w-full h-10 px-2 text-sm border-b-2 bg-gray-200 border-gray-600
                                               rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                />
                                <Smile
                                    className='w-6 h-6 text-blue-600 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                                    onClick={() => togglePicker('message')}
                                />
                                {showEmojiPicker.message && (
                                    <div
                                        ref={setPickerRef('message')}
                                        className="absolute transform -translate-y-full right-12 mt-2 bg-white border border-gray-300 rounded shadow-lg"
                                    >
                                        <Picker
                                            data={data}
                                            emojiSize={20}
                                            emojiButtonSize={28}
                                            onEmojiSelect={(emoji: Emoji) => addEmoji(emoji)}
                                            maxFrequentRows={0}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center space-x-4 px-5'>
                                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <Mic className='w-6 h-6 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                </button>
                                <button
                                    onClick={handleSend}
                                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <SendIcon className='w-6 h-6 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                </button>
                            </div>
                        </div>
                    </div>
            )}
        />
    )
}

export default DiscussionSidebar
