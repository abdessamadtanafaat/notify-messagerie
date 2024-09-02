using System.Collections.Generic;
using System.Threading.Tasks;
using NotificationService.Models;
using NotificationService.Security.Models;

namespace NotificationService.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string id);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(string id, User user);
        Task DeleteUserAsync(string id);
        Task UpdateProfileAsync(string id, UpdateProfileReq updateProfileReq);
        Task<List<User>> GetUsersByIdsAsync(List<string> ids);
        Task UnfriendAsync(string userId, string friendId); 
        Task<List<MyFriends>> SearchUsersByFirstNameOrLastNameAsync(SearchRequest searchRequest); 
        Task AddFriendAsync(string userId, string friendId); 
        Task<string> AnswerInvitationAsync(string userId, string friendId, AnswerInvitationRequest.InvitationResponse answerInvitation); 
Task<IEnumerable<MyFriends>> GetFriendsAsync(string userId, int pageNumber=1, int pageSize=6); 
        Task<IEnumerable<User>> GetMutualFriendsAsync(string userId, string friendId); 

    }
}