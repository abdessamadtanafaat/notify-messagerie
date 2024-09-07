public interface IMessageRepostory {
    Task SaveMessageAsync (Message message); 
    Task<IEnumerable<Message>> GetMessagesForUser(string userId);
    Task UpdateMessageAsync(string IdMessage, Message message); 
    Task<Message> GetMessageByIdAsync(string messageId); 
    Task<IEnumerable<Message>> GetMessagesForDiscussion(string discussionId, DateTime? cursor, int limit);
    Task DeleteMessages(string discussionId); 

}