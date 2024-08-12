
using NotificationService.Models;
using NotificationService.Repositories;

public class DiscussionService : IDiscussionService{
    
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepostory _messageRepository;


    public DiscussionService(IDiscussionRepository discussionRepository,
                             IMessageRepostory messageRepository,
                             IUserRepository userRepository)
    {
        _discussionRepository = discussionRepository;
        _messageRepository = messageRepository;
        _userRepository = userRepository;
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

}