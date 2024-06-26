using System.Collections.Generic;
using System.Threading.Tasks;
using NotificationService.Models;

namespace NotificationService.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string id);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(string id, User user);
        Task DeleteUserAsync(string id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetuserByTokenEmail(string tokenEmail);
        Task <User> GetUserByPhoneAsync(string phoneNumber);
        Task <User>GetUserByUsernameAsync(string userUsername);
        Task<User> GetUserByEmailOrPhoneAsync(string authRequestEmailOrPhoneNumber);
    }
}