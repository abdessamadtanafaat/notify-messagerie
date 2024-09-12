import React, { useCallback } from 'react'
import { ChevronLeft, SearchIcon } from 'lucide-react'
import { debounce } from '../../utils/debounce'

interface FriendsSearchProps {
    searchReq: string;
    setSearchReq: (value: string) => void;
    handleSearchChange: (value: string) => void;
    handleClearSearch: () => void;
}

const FriendsSearch: React.FC<FriendsSearchProps> = ({ searchReq, setSearchReq, handleSearchChange, handleClearSearch }) => {

    // Create a debounced version of the search function
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            handleSearchChange(value)
        }, 300), // Debounce delay of 300ms
        [handleSearchChange]
    )


    // Handle search input change and debounce
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchReq(value)
        debouncedSearch(value)
    }

    return (

        <div className=" relative flex items-center">
            {searchReq && (
                <ChevronLeft
                    className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white'
                    onClick={() => handleClearSearch()}
                />
            )}
            <div className="relative flex-shrink-0 ml-4">
                <input
                    type='text'
                    name='searchReq'
                    placeholder='Search'
                    value={searchReq}
                    onChange={onSearchChange}
                    className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                />
                <SearchIcon className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white' />
            </div>
        </div>
    )

}

export default FriendsSearch