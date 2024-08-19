using MongoDB.Bson;
using MongoDB.Driver;
using NotificationService.Exceptions;
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


    public async Task MarkMessageAsSeen(string messageId,string userId)
    {
    var currentMessage = await _messageRepository.GetMessageByIdAsync(messageId);

    if (currentMessage == null)
    {
        throw new Exception("Message not found.");
    }


    if (!currentMessage.Read){
    var updatedMessage = new Message
    {
        Id = currentMessage.Id,
        Content = currentMessage.Content,
        DiscussionId = currentMessage.DiscussionId,
        SenderId = currentMessage.SenderId,
        Timestamp = currentMessage.Timestamp,
        ReceiverId = currentMessage.ReceiverId,
        Read = true, 
        ReadTime = DateTime.UtcNow 
    };
        await _messageRepository.UpdateMessageAsync(messageId, updatedMessage);
    }

    }

    public async Task<Message> GetMessageById(string messageId) {

                 // Check if id is a valid ObjectId
                if (!ObjectId.TryParse(messageId, out _))
                {
                    throw new NotFoundException($"Message with ID '{messageId}' not found.");
                }
                var message = await _messageRepository.GetMessageByIdAsync(messageId);
                if (message == null)
                {
                    throw new NotFoundException($"Message with ID '{messageId}' not found.");
                }
                return message;
                
    }


    }


}
