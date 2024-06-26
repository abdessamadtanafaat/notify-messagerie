using MongoDB.Bson;
using NotificationService.Exceptions;
using NotificationService.Models;
using NotificationService.Repositories;
using NotificationService.Validators;


namespace NotificationService.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserValidators _userValidators;

        public UserService(IUserRepository userRepository, IUserValidators userValidators )
        {
            _userRepository = userRepository;
            _userValidators = userValidators;
        }

        public Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return _userRepository.GetAllUsersAsync();
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
                // Check if id is a valid ObjectId
                if (!ObjectId.TryParse(id, out _))
                {
                    throw new NotFoundException($"User with ID '{id}' not found.");
                }
                var user = await _userRepository.GetUserByIdAsync(id);
                if (user == null)
                {
                    throw new NotFoundException($"User with ID '{id}' not found.");
                }
                return user;
        }
        
        public Task<User> CreateUserAsync(User user)
        {
            _userValidators.Validate(user); 
            return _userRepository.CreateUserAsync(user);
        }

        public async Task UpdateUserAsync(string id, User user)
        {
            // Check if id is a valid ObjectId
            if (!ObjectId.TryParse(id, out _))
            {
                throw new NotFoundException($"User with ID '{id}' not found.");
            }
            
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                throw new NotFoundException($"User with ID '{id}' not found."); 
            }
            _userValidators.Validate(user);
            await _userRepository.UpdateUserAsync(id, user);
            
        }


        public async Task DeleteUserAsync(string id)
        {
            // Check if id is a valid ObjectId
            if (!ObjectId.TryParse(id, out _))
            {
                throw new NotFoundException($"User with ID '{id}' not found.");
            }
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                throw new NotFoundException($"User with ID '{id}' not found."); 
            }
            
            await _userRepository.DeleteUserAsync(id);
        }
        
    }
}