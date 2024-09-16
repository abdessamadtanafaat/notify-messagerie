import React from 'react'
import WelcomeMessage from '../common/WelcomeMessage'
import LoadingSpinner from '../common/LoadingPage'
import SearchBar from './SearchBar'
import DiscussionListSearch from './DiscussionListSearch'
import DiscussionList from './DiscussionList'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import DiscussionSidebar from './DiscussionSidebar'
import useDiscussionPageHandler from './useDiscussionPageHandler'

const DiscussionPage: React.FC = () => {
    const {
        userId,
        state,
        dispatch,
        fetchingDiscussions,
        initialFetchComplete,
        handleSearchChange,
        handleClearSearch,
        handleUserClick,
    } = useDiscussionPageHandler()

    const { loading, searchReq, selectedUser, idDiscussion, discussions } = state

    const selectedDiscussion = discussions.find(discussion => discussion.id === idDiscussion)
    const isBlocked = selectedDiscussion?.isBlocked || false

    return (
        <>
            {loading && !initialFetchComplete ? (
                <LoadingSpinner />
            ) : (
                <div className="flex h-screen pl-16">
                    <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800">
                        <div className="space-y-4 md:space-y-3 mt-5">
                            <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white">
                                Discussion
                            </h1>
                            <SearchBar 
                                searchReq={searchReq}
                                setSearchReq={(value) => dispatch({ type: 'SET_SEARCH_INPUT', payload: value })}
                                handleSearchChange={handleSearchChange}
                                handleClearSearch={handleClearSearch}
                            />

                            {fetchingDiscussions && !searchReq && (
                                <div className="mt-2">
                                    <LoadingMoreItemsSpinner />
                                </div>
                            )}

                            {searchReq ? (
                                <DiscussionListSearch
                                    userId={userId}
                                    searchReq={searchReq}
                                    handleUserClick={handleUserClick}
                                />
                            ) : (
                                <DiscussionList
                                    userId={userId}
                                    handleUserClick={handleUserClick}
                                />
                            )}
                        </div>
                    </div>

                    {!isBlocked && selectedUser ? (
                        <div className="flex-grow rounded-2xl bg-white dark:bg-gray-800 h-full shadow-xl ml-4 lg:ml-6">
                            <DiscussionSidebar
                                receiver={selectedUser}
                                idDiscussion={idDiscussion}
                            />
                        </div>
                    ) : (
                        <WelcomeMessage />
                    )}
                </div>
            )}
        </>
    )
}

export default DiscussionPage
