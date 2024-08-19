using MongoDB.Driver;
using NotificationService.Repositories;


namespace NotificationService.Services
{
public class MessageService : IMessageService {


    private readonly IMessageRepostory _messageRepository;

    public MessageService(IMessageRepostory messageRepository)
    {
        _messageRepository = messageRepository;
    }
    public async Task SendMessage(Message message) {

        await _messageRepository.SaveMessageAsync(message);

    }

    public async Task<IEnumerable<Message>> GetMessagesForUser(string userId) {

    return await _messageRepository.GetMessagesForUser(userId);

    } 


    public async Task MarkMessageAsSeen(string messageId, string userId)
    {
    var currentMessage = await _messageRepository.GetMessageByIdAsync(messageId);

    if (currentMessage == null)
    {
        throw new Exception("Message not found.");
    }


    if (!currentMessage.Read == false){
    var updatedMessage = new Message
    {
        Id = currentMessage.Id,
        Content = currentMessage.Content,
        SenderId = currentMessage.SenderId,
        ReceiverId = currentMessage.ReceiverId,
        Read = true, // Set the Read status to true
        ReadTime = DateTime.UtcNow // Set the ReadTime to current UTC time
        // Include other properties if needed, ensuring they are set correctly
    };
        await _messageRepository.UpdateMessageAsync(messageId, updatedMessage);
    }

    }

}


}
