import React from 'react'
import Skeleton from 'react-loading-skeleton' // Make sure to install this package or use a similar one.

const DiscussionSidebarSkeleton = () => {
  return (
    <>
      {/* Header Rectangle Skeleton */}
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex items-center justify-between px-5">
          <div className="relative flex items-center space-x-4">
            <Skeleton
              height={32}
              width={32}
              style={{ borderRadius: '50%', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
              className="dark:bg-gray-600 dark:bg-opacity-40"
            />
            <div className="flex flex-col p-1 text-xs">
              <Skeleton
                height={20}
                width={100}
                style={{ marginBottom: '2px', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
                className="dark:bg-gray-600 dark:bg-opacity-40"
              />
              <Skeleton
                height={16}
                width={150}
                style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)' }} 
                className="dark:bg-gray-600 dark:bg-opacity-40"
              />
            </div>
            <div className="flex space-x-2 ml-40">
              <Skeleton
                height={24}
                width={24}
                style={{ borderRadius: '50%', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
                className="dark:bg-gray-600 dark:bg-opacity-40 ml-80"
              />
              <Skeleton
                height={24}
                width={24}
                style={{ borderRadius: '50%', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
                className="dark:bg-gray-600 dark:bg-opacity-40 "
              />
              <Skeleton
                height={24}
                width={24}
                style={{ borderRadius: '50%', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
                className="dark:bg-gray-600 dark:bg-opacity-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Message Skeleton */}
      <div className="flex flex-col items-center space-y-1 mt-6">
        <Skeleton
          height={64}
          width={64}
          style={{ borderRadius: '50%', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
          className="dark:bg-gray-600 dark:bg-opacity-40"
        />
        <Skeleton
          height={24}
          width={120}
          style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
          className="dark:bg-gray-600 dark:bg-opacity-40"
        />
        <Skeleton
          height={16}
          width={180}
          style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
          className="dark:bg-gray-600 dark:bg-opacity-40"
        />
      </div>

      {/* Messages Skeleton */}
      <div className="flex flex-col space-y-4 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`relative flex flex-col ${index % 2 === 0 ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`relative max-w-xs p-1 text-[14px] rounded-xl bg-gray-300 dark:bg-gray-600 ${index % 2 === 0 ? 'text-white' : 'text-black'} animate-pulse`}
              style={{ backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
            >
              <Skeleton
                height={15}
                width={150}
                style={{ backgroundColor: 'rgba(117, 117, 117, 0.4)' }} // light mode background with opacity
                className="dark:bg-gray-600 dark:bg-opacity-40"
              />
            </div>
            <Skeleton
              height={10}
              width={40}
              style={{ marginTop: '4px', backgroundColor: 'rgba(229, 231, 235, 0.4)' }} // light mode background with opacity
              className="dark:bg-gray-600 dark:bg-opacity-40"
            />
          </div>
        ))}
      </div>

    </>
  )
}

export default DiscussionSidebarSkeleton
