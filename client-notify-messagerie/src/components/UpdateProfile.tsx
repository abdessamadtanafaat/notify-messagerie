import React from 'react'
import { PenIcon, Smile } from 'lucide-react'
import { UpdateProfileHandler } from './UpdateProfileHandler'
import Button from './common/Button'
import data, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const UpdateProfile: React.FC = () => {

    return (
        <UpdateProfileHandler
            render={({ avatarUrl, handleChangeAvatar, user, handleUpdate, editing, handleEditToggle, username, about, handleUpdateProfile, charsRemaining, isHovered, handleMouseEnter, handleMouseLeave, showEmojiPicker, togglePicker, handleLogout, isLoadingButton, addEmoji, setPickerRef, isUpLoading,formattedPhoneNumber }) => (
                <div
                    id="view"
                    className="h-full w-screen flex flex-row dark:bg-gray-700"
                    x-data="{ sidenav: true }"
                >
                    <div
                        id="sidebar"
                        className="bg-white dark:bg-gray-800 h-screen md:block shadow-xl px-3 w-30 md:w-80 lg:w-80 overflow-x-hidden transition-transform duration-300 ease-in-out"
                        x-show="sidenav"
                    // @click.away="sidenav = false"
                    >
                        <div className="space-y-4 md:space-y-5 mt-5">
                            <h1 className="hidden md:block font-bold text-sm md:text-xl text-center dark:text-white">
                                Profile
                            </h1>
                            <div className="relative flex items-center justify-center">
                                <img
                                    src={avatarUrl}
                                    alt="Avatar user"
                                    className="w-10 h-10 md:w-36 md:h-36 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                />


                                {isUpLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 md:w-36 md:h-36 border-4 border-t-4 border-gray-200 border-t-blue-500 border-solid rounded-full animate-spin"></div>
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
                                    <label className="flex items-center justify-center w-10 h-10 md:w-36 md:h-36 bg-black rounded-full opacity-50 cursor-pointer">
                                        <input
                                            type="file"
                                            name="image"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleChangeAvatar}
                                        />
                                        <PenIcon className='w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer' />
                                    </label>
                                </div>
                            </div>
                            <form onSubmit={handleUpdateProfile}>
                                <div className='flex flex-col justify-start bg-white dark:bg-gray-800 dark:text-white p-4 mb-1'>
                                    {/* <p className='mb-1 text-sm md:text-base text-gray-600' >Name</p> */}
                                    <div className='flex items-center justify-between space-x-2'>
                                        {editing.username ? (
                                            <div className='flex flex-col space-y-2'>
                                                <input
                                                    type='text'
                                                    name='Username'
                                                    placeholder=''
                                                    value={username}
                                                    onChange={(e) => handleUpdate('username', e.target.value)}
                                                    autoFocus={true}
                                                    className='h-8 px-2 text-sm md:text-base border-b-2 border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700
                                                                focus:border-blue-400 focus:outline-none'
                                                />

                                                <div className='flex justify-end space-x-4 relative'>
                                                    <Smile className='w-5 h-6 text-gray-600  cursor-pointer dark:text-gray-400 dark:hover:text-white'
                                                        onClick={() => togglePicker('username')} />
                                                    {showEmojiPicker.username
                                                        &&
                                                        <div ref={setPickerRef('username')}
                                                            className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-300 rounded shadow-lg"                                                         >
                                                            <Picker
                                                                data={data}
                                                                emojiSize={20}
                                                                emojiButtonSize={28}
                                                                onEmojiSelect={(emoji: Emoji) => addEmoji(emoji)}
                                                                maxFrequentRows={0}

                                                            />
                                                        </div>}
                                                    <Button
                                                        text={`${isHovered.username ? 'Done' : `${charsRemaining.username} / 25`}`}
                                                        onClick={() => { /* your handler */ }}
                                                        className='w-4/12 h-6 text-xs md:text-sm bg-blue-400 text-white hover:bg-blue-600 hover:text-white'
                                                        onMouseEnter={() => handleMouseEnter('username')}
                                                        onMouseLeave={() => handleMouseLeave('username')}
                                                        loading={isLoadingButton.updateProfile}

                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className='flex-1 text-sm md:text-base font-bold'>
                                                {user?.username ?? ''}
                                            </p>
                                        )}
                                        <PenIcon className='w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer dark:hover:text-white'
                                            onClick={() => handleEditToggle('username')}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col justify-start bg-white dark:bg-gray-800 dark:text-white p-4 mb-1'>
                                    <p className='mb-1 text-sm md:text-base text-gray-600 dark:text-white' >About</p>
                                    <div className='flex items-center justify-between space-x-2'>

                                        {editing.about ? (
                                            <div className='flex flex-col space-y-2'>
                                                <input
                                                    type='text'
                                                    name='About'
                                                    placeholder=''
                                                    value={about}
                                                    onChange={(e) => handleUpdate('about', e.target.value)}
                                                    autoFocus={true}
                                                    className='h-8 px-2 text-sm md:text-base border-b-2 border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700
                                                            focus:border-blue-400 focus:outline-none'
                                                />

                                                <div className='flex justify-end space-x-4 relative '>
                                                    <Smile className='w-5 h-6 text-gray-600 cursor-pointer hover:text-gray-900 dark:hover:text-white dark:text-gray-400'
                                                        onClick={() => togglePicker('about')} />
                                                    {showEmojiPicker.about
                                                        &&
                                                        <div ref={setPickerRef('about')}
                                                            className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-300 rounded shadow-lg"

                                                        >
                                                            <Picker
                                                                data={data}
                                                                emojiSize={20}
                                                                emojiButtonSize={28}
                                                                onEmojiSelect={(emoji: Emoji) => addEmoji(emoji)}
                                                                maxFrequentRows={0}

                                                            />
                                                        </div>}
                                                    <Button
                                                        text={`${isHovered.about ? 'Done' : `${charsRemaining.about}/139`}`}
                                                        onClick={() => { /* your handler */ }}
                                                        className='w-4/12 h-6 text-xs md:text-sm bg-blue-400 text-white hover:bg-blue-600 hover:text-white'
                                                        onMouseEnter={() => handleMouseEnter('about')}
                                                        onMouseLeave={() => handleMouseLeave('about')}
                                                        loading={isLoadingButton.updateProfile}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className='flex-1 text-sm md:text-base'>
                                                {user?.about ?? ''}
                                            </p>
                                        )}

                                        <PenIcon className='w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer dark:hover:text-white'
                                            onClick={() => handleEditToggle('about')}

                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col justify-start bg-white dark:bg-gray-800 dark:text-white p-4 mb-1'>
                                    <p className='mb-1 text-sm md:text-base text-gray-600 dark:text-white' >Phone number</p>
                                    <div className='flex items-center justify-between space-x-2'>
                                        <p className='flex-1 text-sm md:text-base'>
                                            {formattedPhoneNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-start bg-white dark:bg-gray-800 dark:text-white p-4 mb-1'>
                                    <div className="dark:border-gray-300 border-t border-gray-700 my-4"></div>
                                    <p className='mb-1 text-sm md:text-base text-gray-600 dark:text-white'>
                                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <Button
                                        text='Log out'
                                        onClick={handleLogout}
                                        className='mt-5 w-4/12 h-8 bg-red-400 dark:bg-gray-700 font-articulatThin dark:text-red-400 dark:hover:bg-gray-400 hover:bg-red-400 hover:text-black text-black'
                                        loading={isLoadingButton.logout}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
)}
        />
    )
}



export default UpdateProfile
