import React from 'react'
import { getAvatarUrl } from '../../utils/userUtils'
import { User } from '../../interfaces'
import { PersonnesHandler } from './PersonnesHandler'

interface EnLignePersonnesProps {
    onUserClick: (user: User) => void
    theme: string
}

const EnLignePersonnes: React.FC<EnLignePersonnesProps> = ({ onUserClick, theme }) => {



    return (
            <PersonnesHandler
                render={({ friends }) => (
                    <div className="space-y-4 md:space-y-5 mt-5">
                            <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white">
                            Personnes
                        </h1>
                        <p className='mb-2 text-base text-gray-600 dark:text-gray-300'>
                            Contacts actifs ({friends.filter(user => user.active).length})
                        </p>
                        <ul className="list-none flex flex-col space-y-4">
                            {friends
                            .filter(friend => friend.active)
                            .map(friend => (
                                <li key={friend.id}
                                    className="relative flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                                    onClick={() => onUserClick(friend)}>
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={getAvatarUrl(theme, friend)}
                                            alt="Avatar user"
                                            className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                        />
                                        <div
                                            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${friend.active ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ transform: 'translate(25%, 25%)' }}
                                        />
                                    </div>
                                    <p className="font-semibold text-base text-dark dark:text-white">
                                        {friend.firstName} {friend.lastName}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            />
    )
}
export default EnLignePersonnes