
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
            Users = receiver,
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
    

public async Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId, int pageNumber=1, int pageSize=6)
{

            if (string.IsNullOrWhiteSpace(userId)) {
            throw new ArgumentNullException("User ID cannot be empty or whitespace."); 
            } 
            var user = await _userRepository.GetUserByIdAsync(userId); 
            if (user == null) {
                throw new NotFoundException ($"User With ID '{userId}' not found."); 
            }

    var discussions = await _discussionRepository.GetDiscussionsForUser(userId, pageNumber, pageSize);

    var discussionDtos = new List<DiscussionDto>();

    foreach (var discussion in discussions)
    {

        var receiverId = discussion.Participants.FirstOrDefault(id => id != userId);

        var receiver = await _userRepository.GetUserByIdAsync(receiverId);
        if (receiver == null)
        {
            continue;
        }

        var messages = await _messageRepository.GetMessagesForDiscussion(discussion.Id, null, 10);

        var lastMessage = messages.OrderByDescending(m => m.Timestamp).FirstOrDefault();

        discussionDtos.Add(new DiscussionDto
        {
            Id = discussion.Id,
            Receiver = receiver,
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

    public async Task DeleteDiscussionAsync(string discussionId)
        {
            // Check if id is a valid ObjectId
            if (!ObjectId.TryParse(discussionId, out _))
            {
                throw new NotFoundException($"Discussion with ID '{discussionId}' not found.");
            }
            var existingDiscussion = await _discussionRepository.GetDiscussionByIdAsync(discussionId);
            if (existingDiscussion == null)
            {
                throw new NotFoundException($"Discussion with ID '{discussionId}' not found.");
            }

            await _discussionRepository.DeleteDiscussionAsync(discussionId);
            await _messageRepository.DeleteMessages(discussionId); 
        }
    public async Task DoWithDiscussion(string discussionId,  DoingWithDiscussion.DoingWithDiscussionOperation doingWithDiscussionChoice) {
    
    var existingDiscussion = await _discussionRepository.GetDiscussionByIdAsync(discussionId);
 
    if (existingDiscussion == null)
    {
        throw new NotFoundException($"Discussion with ID '{discussionId}' not found.");
    }

    switch (doingWithDiscussionChoice) 
    {
        case DoingWithDiscussion.DoingWithDiscussionOperation.Blocked: 
        existingDiscussion.IsBlocked = ! existingDiscussion.IsBlocked; 
        break;

                case DoingWithDiscussion.DoingWithDiscussionOperation.Archived:
            existingDiscussion.IsArchived = !existingDiscussion.IsArchived;
            break;

        case DoingWithDiscussion.DoingWithDiscussionOperation.Pinned:
            existingDiscussion.IsPinned = !existingDiscussion.IsPinned;
            break;

        default:
            throw new ArgumentOutOfRangeException(nameof(doingWithDiscussionChoice), $"Not expected direction value: {doingWithDiscussionChoice}");

    }

    await _discussionRepository.UpdateDiscussionAsync(existingDiscussion.Id, existingDiscussion); 

    }

    public async Task<IEnumerable<DiscussionDto>> SearchUsersByFirstNameOrLastNameOrLastMessageAsync(SearchRequest searchRequest,int pageNumber,int pageSize) 
    {
            if (string.IsNullOrWhiteSpace(searchRequest.UserId))
            {
                throw new ArgumentException("User ID cannot be empty or whitespace.");
            }

            var currentUser = await _userRepository.GetUserByIdAsync(searchRequest.UserId);

            if (currentUser == null)
            {
                throw new NotFoundException($"User with ID '{searchRequest.UserId}' not found.");
            }

            // GET ALL THE DISCUSSIONS WHERE THE FRIST ELEMENT (0) OF THE PARTICICPANT = SEARCHREQUEST.USERID 
            // GET ALL THE USERS (GET THE FIRST NAME AND LAST NAME ) WHERE THE FRIST ELEMENT (0) OF THE PARTICICPANT = SEARCHREQUEST.USERID 
            // THE SECONDE ELEMENT (1) ID OF OTHER PARTICIPANT THAT YOU NEED TO GET THE USER BY IT'S ID AND USING _USERREPOSITORY.GETUSERBYID
            // WHEN WE GET THE USERS , WE RETURN THE DISCUSSIONSDTO THAT  SEARCHREQEUST.SearchReq  CONTAINS LAST NAME OR FIRST NAME OF THE USER ,  IF NOT SEARCHREQEUST.SearchReq CONTAINS THE LASTMESSAGECONTENT , 

                // Retrieve all discussions where the first participant is the current user
    var discussions = await _discussionRepository.GetDiscussionsByParticipantIdAsync(searchRequest.UserId);

    var filteredDiscussions = new List<DiscussionDto>();

    foreach (var discussion in discussions)
    {
        // Get the ID of the other participant
        var otherParticipantId = discussion.Participants.FirstOrDefault(id => id != searchRequest.UserId);

        if (otherParticipantId == null)
        {
            continue;
        }

        // Retrieve the other participant's user information
        var otherParticipant = await _userRepository.GetUserByIdAsync(otherParticipantId);

        if (otherParticipant == null)
        {
            continue;
        }

        // Filter based on first name, last name, or last message content
        if (otherParticipant.FirstName.Contains(searchRequest.SearchReq, StringComparison.OrdinalIgnoreCase) ||
            otherParticipant.LastName.Contains(searchRequest.SearchReq, StringComparison.OrdinalIgnoreCase) ||
            discussion.LastMessageContent.Contains(searchRequest.SearchReq, StringComparison.OrdinalIgnoreCase))
        {
            // Create the DiscussionDto to return
            var discussionDto = new DiscussionDto
            {
                Id = discussion.Id,
                Receiver = otherParticipant,
                LastMessage = new Message
                {
                    Content = discussion.LastMessageContent,
                    Timestamp = discussion.LastMessageTimestamp
                }
            };

            filteredDiscussions.Add(discussionDto);
        }
    }

    return filteredDiscussions; 



    }

}