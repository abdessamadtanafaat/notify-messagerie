public interface IMessageService {
    Task SendMessage(Message message); 
    Task<IEnumerable<Message>> GetMessagesForUser(string userId); 
}