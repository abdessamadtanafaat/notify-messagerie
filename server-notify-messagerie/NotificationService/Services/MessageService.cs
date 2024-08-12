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


}


}
