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
<>
            <EnLignePersonnes
                onUserClick={handleUserClick}
                theme={theme}
            />
            {selectedUser && (
                <>
                    <FriendInfoSidebar
                        user={selectedUser}
                    />
                    <DiscussionSidebar
                        user={selectedUser}
                    />
                </>
            )}
        </>
    )
}
