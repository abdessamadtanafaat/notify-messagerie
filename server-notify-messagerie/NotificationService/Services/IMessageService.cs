public interface IMessageService {
    Task SendMessage(Message message); 
    Task<IEnumerable<Message>> GetMessagesForUser(string userId);
    Task MarkMessageAsSeen(string messageId, string userId);

}