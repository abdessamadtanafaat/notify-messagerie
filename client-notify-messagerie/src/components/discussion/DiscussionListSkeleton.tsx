import Skeleton from 'react-loading-skeleton'




const DiscussionListSkeleton = () => {
  return (
    
        <div className="absolute top-4 left-20 md:w-80 lg:w-72 flex-shrink-0 rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl px-4 md:px-8 overflow-y-auto">
            <div className="space-y-4 md:space-y-3 mt-5">
                {/* Skeleton for Header */}
                <div className="hidden md:block">
                    <Skeleton height={30} width={150} style={{ opacity: 0.2, backgroundColor: '#E5E7EB' }} />
                </div>

                {/* Skeleton for Search Input */}
                <div className='relative flex-grow'>
                    <Skeleton height={40} width="100%" style={{ opacity: 0.2, backgroundColor: '#E5E7EB' }} />
                </div>

                {/* Skeleton for List Items */}
                <ul className="list-none flex flex-col space-y-2">
                    {Array(5).fill(null).map((_, index) => (
                        <li
                            key={index}
                            className="flex flex-col space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                        >
                            <div className="flex items-center space-x-3">
                                {/* Skeleton for Avatar */}
                                <div className="relative flex-shrink-0">
                                    <Skeleton circle={true} height={24} width={24} style={{ opacity: 0.2, backgroundColor: '#E5E7EB' }} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    {/* Skeleton for Name */}
                                    <Skeleton height={20} width={100} style={{ opacity: 0.2, backgroundColor: '#E5E7EB' }} />
                                    <div className="flex items-center space-x-2 text-xs">
                                        {/* Skeleton for Last Message */}
                                        <Skeleton height={20} width={120} style={{ opacity: 0.2, backgroundColor: '#E5E7EB' }} />
                                        {/* Skeleton for Timestamp */}
                                        <Skeleton height={15} width={50} style={{ opacity: 0.2, backgroundColor: '#E5E7EB' }} />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

  )
}

export default DiscussionListSkeleton
