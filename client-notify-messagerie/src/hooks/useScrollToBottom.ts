// src/hooks/useScrollToBottom.ts
import { useEffect, RefObject } from 'react'

const useScrollToBottom = (ref: RefObject<HTMLElement>, dependencies: any[] = []) => {
  useEffect(() => {
    const element = ref.current
    if (element) {
      const lastElement = element.lastElementChild as HTMLElement
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }
  }, dependencies) // Trigger effect whenever dependencies change
}

export default useScrollToBottom
