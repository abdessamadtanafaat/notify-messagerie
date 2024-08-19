
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

    public async Task <SingleDiscussion> GetDiscussionForTwoUsers(string userId, string selectedUserId)
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
 
    var messages = await _messageRepository.GetMessagesForDiscussion(discussion.Id);

    var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();

    var receiver = await _userRepository.GetUserByIdAsync(selectedUserId);

        // mark as read because you get the discussion
        // if (!lastMessage.Read && lastMessage.SenderId == userId){

        // lastMessage.Read = true;
        // lastMessage.ReadTime = DateTime.Now;
        // await _messageRepository.UpdateMessageAsync(lastMessage.Id, lastMessage); 
        // }
        
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
            Messages = messages.Select(m=> new Message{
             Id = m.Id, 
            Content = m.Content,
        Timestamp = m.Timestamp,
        SenderId = m.SenderId,
        ReceiverId = m.ReceiverId, 
        DiscussionId = m.DiscussionId, 
        Read = m.Read, 
        ReadTime = m.ReadTime,
    }).ToList()

    }; 

    return discussionDto; 



    }
    

    public async Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId)
{
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
    }

    var discussions = await _discussionRepository.GetDiscussionsForUser(userId);
    var discussionDtos = new List<DiscussionDto>();

    foreach (var discussion in discussions)
    {
        // Assuming `Participants` list includes the userId, fetch the other participant
        var receiverId = discussion.Participants.FirstOrDefault(id => id != userId);
        var receiver = await _userRepository.GetUserByIdAsync(receiverId);

        if (receiver == null)
        {
            // Handle case where user is not found
            continue;
        }

        var messages = await _messageRepository.GetMessagesForDiscussion(discussion.Id);
        var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();




            //lastMessage.ReadTime = DateTime() ; 
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
    }

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