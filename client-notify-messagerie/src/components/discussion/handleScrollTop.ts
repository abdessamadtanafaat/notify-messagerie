interface HandleScrollProps {
  fetchMessages: (cursor?: Date | null) => void;
  cursor: Date | null;
  hasMore: boolean;
  loadingMore: boolean;
  setScrollTop: React.Dispatch<React.SetStateAction<number>>;
}

const handleScroll = ({ fetchMessages, cursor, hasMore, loadingMore, setScrollTop }: HandleScrollProps) => {
  
  return (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop

    // Update the scroll position state
    setScrollTop(scrollTop)

    // Check if the user scrolled to the top
    const atTop = scrollTop === 0

    // If at the top, check if we have more messages to fetch and we're not already loading
    if (atTop && hasMore && !loadingMore) {
      fetchMessages(cursor || undefined)

      // Only adjust scroll position if initial fetch is not complete
        setTimeout(() => {
          container.scrollTop = 30 // Adjust this value as needed
        }, 500) // Delay to ensure the fetch has updated the scrollHeight
    }

    

    // If there are no more messages to load, prevent further scrolling up
    if (atTop && !hasMore) {
      container.scrollTop = 1 // Adjust this value to prevent the user from hitting the top
    }
  }
}

export default handleScroll
