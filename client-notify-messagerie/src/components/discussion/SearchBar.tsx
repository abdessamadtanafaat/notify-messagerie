import { ChevronLeft, SearchIcon } from 'lucide-react'
import { useCallback } from 'react'
import { Discussion } from '../../interfaces/Discussion'
import messageService from '../../services/messageService'
import { debounce } from '../../utils/debounce'
import { useAuth } from '../../contexte/AuthContext'


interface SearchBarProps {
    setSearchResults: (results: Discussion[]) => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm,setSearchResults,onClearSearch }) => {

    const { user } = useAuth()       
    const searchUsers = async (userId: string, searchReq: string) => {
        try {
            if (user) {
                const searchRequest = { userId, searchReq }
                const response = await messageService.searchUsersByFirstNameOrLastNameOrLastMessageAsync(searchRequest, 1, 10)
                console.log(response)
                setSearchResults(response)
            }
        } catch (error) {
            console.log('Failed to fetch users.')
        }

    }
    const debouncedSearchUsers = useCallback(
        debounce(async (userId: string, searchReq: string) => {
            if (searchReq.trim()) {
                await searchUsers(userId, searchReq)
            } else {
                setSearchResults([]) 
            }
        }, 300), []
    )

    
    const handleChange = (value: string) => {
        setSearchTerm(value)
            if (user) {
                debouncedSearchUsers(user.id, value)
            }
    }

    return (
        <div className="flex items-center space-x-2">
            {searchTerm && (
                <ChevronLeft
                    className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white'
                    onClick={onClearSearch}
                />
            )}
            <div className='relative flex-grow'>
                <input
                    type='text'
                    name='searchInDiscussion'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={(e) => handleChange(e.target.value)}
                    className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                />
                <SearchIcon
                    className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                />
            </div>
        </div>
    )
}
export default SearchBar
