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
      const scrollTop = e.currentTarget.scrollTop
  
      setScrollTop(scrollTop)
      const top = scrollTop === 0
      if (top && hasMore && !loadingMore) {
        fetchMessages(cursor || undefined)
      }
      if (top) {
        container.scrollTop = 50
      }
    }
  }
  
  export default handleScroll
  