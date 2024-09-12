import React from 'react'
import { ArchiveIcon, CircleMinus, DeleteIcon, Pin, PinOff } from 'lucide-react'
import { Action } from './DiscussionReducer'

import { handleDeleteDiscussion, handleBlockDiscussion, handleArchiveDiscussion, handlePinDiscussion } from './DiscussionMenuHandler'

interface DiscussionMenuProps {
    idDiscussion: string;
    isMenuOpen: boolean;
    dispatch: React.Dispatch<Action>;
    menuRef: React.RefObject<HTMLUListElement>;
    isPinned: boolean;
    isBlocked: boolean;
}

const DiscussionMenu: React.FC<DiscussionMenuProps> = ({ idDiscussion, isMenuOpen, menuRef, dispatch, isPinned, isBlocked }) => {



    const handleMenuAction = async (action: () => Promise<void>) => {
        await action()
        dispatch({ type: 'TOGGLE_MENU', payload: null })
    }


  const handlePinAction = async () => {
    await handlePinDiscussion(idDiscussion)
    dispatch({ type: 'TOGGLE_PIN', payload: idDiscussion })
}

    if (!isMenuOpen) return null
    return (
        <ul
            className=" bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg mt-1"
            ref={menuRef}
        >
            <li
                className="relative transition-transform transform hover:scale-95"
                onClick={() => handleMenuAction(() => handleArchiveDiscussion(idDiscussion))}
            >
                <a
                    className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                >
                    <ArchiveIcon className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                    <span className="text-xs">Archive the discussion</span>
                </a>
            </li>
            <li
                className="relative transition-transform transform hover:scale-95"
                onClick={() => handleMenuAction(() => handleDeleteDiscussion(idDiscussion))}
            >
                <a
                    className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                >
                    <DeleteIcon className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                    <span className="text-xs">Delete the discussion</span>
                </a>
            </li>
            <li
                className="relative transition-transform transform hover:scale-95"
                onClick={() => handleMenuAction(() => handleBlockDiscussion(idDiscussion))}
            >
                <a
                    className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                >
                    {isBlocked ? (

                        <>
                            <CircleMinus className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                            <span className="text-xs">Unblock</span>
                        </>

                    ) : (
                        <>
                            <CircleMinus className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                            <span className="text-xs">Block</span>
                        </>

                    )}
                </a>
            </li>
            <li
                className="relative transition-transform transform hover:scale-95"
                //onClick={() => handleMenuAction(() => handlePinDiscussion(idDiscussion))}
                onClick={handlePinAction}
            >
                <a
                    className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                >
                    {isPinned ? (
                        <>
                            <PinOff className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                            <span className="text-xs">Unpin</span>
                        </>
                    ) : (
                        <>
                            <Pin className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                            <span className="text-xs">Pin</span>
                        </>
                    )}

                </a>
            </li>

        </ul>
    )
}

export default DiscussionMenu
