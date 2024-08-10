import React, { useState } from 'react'
import EnLignePersonnes from '../personnes/EnLignePersonnes'
import DiscussionSidebar from '../personnes/DiscussionSidebar'
import { useThemeContext } from '../../contexte/ThemeContext'
import { User } from '../../interfaces'

export default function Discussion() {

    const { theme } = useThemeContext()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const handleUserClick = (user: User) => {
        setSelectedUser(user)
    }
    
    return (
        <>
                    <EnLignePersonnes
                        onUserClick={handleUserClick}
                        theme={theme}
                    />
                    {selectedUser && (
                        <>
                            <DiscussionSidebar
                                user={selectedUser}
                            />
                        </>
                    )}
                </>
            )

    
}
