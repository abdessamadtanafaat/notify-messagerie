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
        Task<List<User>> SearchUsersByFirstNameOrLastNameAsync(SearchRequest searchRequest); 



    }
}