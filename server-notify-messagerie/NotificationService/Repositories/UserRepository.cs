using System.IO.IsolatedStorage;
using MongoDB.Bson;
using MongoDB.Driver;
using NotificationService.Exceptions;
using NotificationService.Models;
using Twilio.Types;

namespace NotificationService.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users;

        public UserRepository(MongoDbContext context)
        {
            _users = context.Users;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _users.Find(u => true).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
                return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            user.Id = null;
            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task UpdateUserAsync(string id, User user)
        {
            var objectId = new ObjectId(id); 
            await _users.ReplaceOneAsync(u => u.Id == id, user);
        }

        public async Task DeleteUserAsync(string id)
        {
            await _users.DeleteOneAsync(u => u.Id == id);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> GetuserByTokenEmail(string tokenEmail)
        {
            return await _users.Find(u => u.TokenEmail == tokenEmail).FirstOrDefaultAsync(); 
        }

        public async Task <User> GetUserByPhoneAsync(string phoneNumber)
        {
            return await _users.Find(u => u.PhoneNumber == phoneNumber).FirstOrDefaultAsync(); 
        }

        public async Task<User> GetUserByUsernameAsync(string userUsername)
        {
            return await _users.Find(u => u.Username == userUsername).FirstOrDefaultAsync();
        }

        public async Task<User> GetUserByEmailOrPhoneAsync(string EmailOrPhoneNumber)
        {
            if (!IsEmail(EmailOrPhoneNumber))
            {
                EmailOrPhoneNumber = new string(EmailOrPhoneNumber.Where(char.IsDigit).ToArray());

                if (EmailOrPhoneNumber.StartsWith("0"))
                {
                    EmailOrPhoneNumber = "+212" + EmailOrPhoneNumber.Substring(1);
                }
                else if (!EmailOrPhoneNumber.StartsWith("+"))
                {
                    EmailOrPhoneNumber = "+" + EmailOrPhoneNumber;
                }

                return await _users.Find(u => u.PhoneNumber == EmailOrPhoneNumber)
                                           .FirstOrDefaultAsync();
            }
            else
            {
                return await _users.Find(u => u.Email == EmailOrPhoneNumber).FirstOrDefaultAsync();
            }

        }

        private bool IsEmail(string authRequestEmailOrPhoneNumber)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(authRequestEmailOrPhoneNumber);
                return addr.Address == authRequestEmailOrPhoneNumber;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}