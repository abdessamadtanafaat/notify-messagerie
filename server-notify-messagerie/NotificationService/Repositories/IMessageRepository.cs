public interface IMessageRepostory {
    Task SaveMessageAsync (Message message); 
    Task<IEnumerable<Message>> GetMessagesForUser(string userId);
    Task<IEnumerable<Message>> GetMessagesForDiscussion(string discussionId); 
    Task UpdateMessageAsync(string IdMessage, Message message); 
    Task<Message> GetMessageByIdAsync(string messageId); 

}