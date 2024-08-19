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
        public Task <User> GetUserByPhoneAsync(string phoneNumber);
        Task <User> GetUserByPhoneAndEmailAsync(string phoneNumber, string email);
        Task <User>GetUserByUsernameAsync(string userUsername);
        Task<User> GetUserByEmailOrPhoneAsync(string authRequestEmailOrPhoneNumber);
        Task<User> GetuserByTokenPhoneNumber(int tokenPhoneNumber);
        Task<User> GetUserByPhoneNumberVerifiedAsync (string phoneNumber); 
        Task<List<User>> GetUsersByIdsAsync(List<string> ids);
        Task<List<User>> GetFriendsBySearchRequestAsync(String[] friendIds, string searchRequest);



    }
}