using System.Collections.Generic;
using System.Threading.Tasks;
using NotificationService.Models;

namespace NotificationService.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string id);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(string id, User user);
        Task DeleteUserAsync(string id);
        Task UpdateAvatarUserAsync(string id, string avatarUrl);


    }
}