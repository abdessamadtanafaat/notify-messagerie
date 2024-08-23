// // src/hooks/useDebounce.ts
// import { useCallback, useRef } from 'react'

// function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
//     const timerRef = useRef<NodeJS.Timeout | null>(null)

//     const debouncedCallback = useCallback((...args: Parameters<T>) => {
//         if (timerRef.current) {
//             clearTimeout(timerRef.current)
//         }
//         timerRef.current = setTimeout(() => {
//             callback(...args)
//         }, delay)
//     }, [callback, delay])

//     return debouncedCallback as T
// }

// export default useDebounce
