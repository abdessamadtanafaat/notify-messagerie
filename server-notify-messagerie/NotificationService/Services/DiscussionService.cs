
using MongoDB.Bson;
using NotificationService.Exceptions;
using NotificationService.Models;
using NotificationService.Repositories;

public class DiscussionService : IDiscussionService{
    
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepostory _messageRepository;


    public DiscussionService(IDiscussionRepository discussionRepository,
                             IMessageRepostory messageRepository,
                             IUserRepository userRepository
                            )
    {
        _discussionRepository = discussionRepository;
        _messageRepository = messageRepository;
        _userRepository = userRepository;
    }

    public async Task <SingleDiscussion> GetDiscussionForTwoUsers(string userId, string selectedUserId, DateTime? cursor = null, int limit = 10)
    {
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
    }

    if (string.IsNullOrWhiteSpace(selectedUserId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(selectedUserId));
    }

    var discussion = await _discussionRepository.GetDiscussionForTwoUsers(userId, selectedUserId);
 
    var messages = await _messageRepository.GetMessagesForDiscussion(discussion.Id, cursor, limit);
    var reversedMessages = messages.Reverse().ToList();


    //var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();

    var receiver = await _userRepository.GetUserByIdAsync(selectedUserId);

        
    var discussionDto = new SingleDiscussion {
            Id = discussion.Id,
            Users = new UserDto
            {
                Id = receiver.Id,
                FirstName = receiver.FirstName,
                LastName = receiver.LastName,
                AvatarUrl = receiver.AvatarUrl,
                Active = receiver.Active,
                LastLogout = receiver.LastLogout,
            },
            Messages = reversedMessages.Select(m=> new Message{
             Id = m.Id, 
            Content = m.Content,
        Timestamp = m.Timestamp,
        SenderId = m.SenderId,
        ReceiverId = m.ReceiverId, 
        DiscussionId = m.DiscussionId, 
        Read = m.Read, 
        ReadTime = m.ReadTime,
        Type = m.Type,
    }).ToList()

    }; 

    return discussionDto; 



    }
    

public async Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId, DateTime? cursor, int limit)
{
    // Debug: Print input parameters
    Console.WriteLine($"Debug: UserID: {userId}");
    Console.WriteLine($"Debug: Cursor: {cursor}");
    Console.WriteLine($"Debug: Limit: {limit}");

    var discussions = await _discussionRepository.GetDiscussionsForUser(userId, cursor, limit);
    Console.WriteLine($"Debug: Discussions fetched: {discussions.Count()}");

    var discussionDtos = new List<DiscussionDto>();

    foreach (var discussion in discussions)
    {
        Console.WriteLine($"Debug: Processing Discussion ID: {discussion.Id}");
        Console.WriteLine($"Debug: Participants: {string.Join(", ", discussion.Participants)}");

        var receiverId = discussion.Participants.FirstOrDefault(id => id != userId);
        Console.WriteLine($"Debug: Receiver ID: {receiverId}");

        var receiver = await _userRepository.GetUserByIdAsync(receiverId);
        if (receiver == null)
        {
            Console.WriteLine($"Debug: Receiver with ID {receiverId} not found.");
            continue;
        }

        var messages = await _messageRepository.GetMessagesForDiscussion(discussion.Id, null, 10);
        Console.WriteLine($"Debug: Messages fetched for Discussion ID {discussion.Id}: {messages.Count()}");

        var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();
        if (lastMessage != null)
        {
            Console.WriteLine($"Debug: Last Message ID: {lastMessage.Id}");
            Console.WriteLine($"Debug: Last Message Content: {lastMessage.Content}");
            Console.WriteLine($"Debug: Last Message Timestamp: {lastMessage.Timestamp}");
        }
        else
        {
            Console.WriteLine($"Debug: No messages found for Discussion ID {discussion.Id}");
        }

        discussionDtos.Add(new DiscussionDto
        {
            Id = discussion.Id,
            Receiver = new UserDto
            {
                Id = receiver.Id,
                FirstName = receiver.FirstName,
                LastName = receiver.LastName,
                AvatarUrl = receiver.AvatarUrl,
                Active = receiver.Active,
                LastLogout = receiver.LastLogout,
            },
            LastMessage = lastMessage
        });

        Console.WriteLine($"Debug: DiscussionDto added for Discussion ID: {discussion.Id}");
    }

    Console.WriteLine($"Debug: Total DiscussionDto count: {discussionDtos.Count}");
    return discussionDtos;
}

    
    public async Task UpdateDiscussion(string idDiscussion, Message message) {


            // Check if id is a valid ObjectId
            if (!ObjectId.TryParse(idDiscussion, out _))
            {
                throw new NotFoundException($"Discussion with ID '{idDiscussion}' not found.");
            }
            
            var existingDiscussion = await _discussionRepository.GetDiscussionByIdAsync(idDiscussion);
            if (existingDiscussion == null)
            {
                throw new NotFoundException($"Discussion with ID '{idDiscussion}' not found."); 
            }
            
            existingDiscussion.LastMessageContent = message.Content; 
            existingDiscussion.LastMessageTimestamp = message.Timestamp; 
        await _discussionRepository.UpdateDiscussionAsync(idDiscussion, existingDiscussion); 
    }
}