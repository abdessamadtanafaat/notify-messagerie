import { useCallback, useEffect, useRef } from 'react'

interface UseHandleScrollProps {
    loadMoreFunction?: (userId: string, searchReq?: string) => void; // Adjust as needed
    userId?: string;
    searchReq?: string; // Adjust as needed
}

const useHandleScroll = ({ loadMoreFunction, userId, searchReq }: UseHandleScrollProps) => {
    const observerRef = useRef<HTMLDivElement>(null)

    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            const scrollableHeight = scrollHeight - clientHeight
            const buffer = 200 // Buffer before triggering loadMoreFunction

            if (scrollableHeight - scrollTop <= buffer) {
                if (loadMoreFunction && userId !== undefined ) {
                    loadMoreFunction(userId, searchReq)
                }
            }
        }
    }, [loadMoreFunction, userId, searchReq])

    useEffect(() => {
        const element = observerRef.current
        if (element) {
            element.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll)
            }
        }
    }, [handleScroll])

    return { observerRef }
}

export default useHandleScroll
