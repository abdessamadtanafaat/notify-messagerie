using MongoDB.Bson;
using NotificationService.Exceptions;
using NotificationService.Models;
using NotificationService.Repositories;
using NotificationService.Security.Models;
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
        public async Task<List<User>> GetUsersByIdsAsync(List<string> ids)
        {
            // Validate and convert string IDs to ObjectId
            var objectIds = ids
                .Where(id => ObjectId.TryParse(id, out _))
                .Select(id => new ObjectId(id))
                .ToList();

            if (objectIds.Count == 0)
            {
                throw new ArgumentException("No valid IDs provided.");
            }

            // Fetch users by IDs
            var users = await _userRepository.GetUsersByIdsAsync(ids);

            // Handle case where some users might not be found
            var missingIds = ids.Except(users.Select(user => user.Id)).ToList();
            if (missingIds.Any())
            {
                throw new NotFoundException($"Users with IDs '{string.Join(", ", missingIds)}' not found.");
            }

            return users;
        }

        public Task<User> CreateUserAsync(User user)
        {
            _userValidators.Validate(user); 
            return _userRepository.CreateUserAsync(user);
        }

        public async Task UpdateProfileAsync(string id, UpdateProfileReq updateProfileReq)
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
            //_userValidators.Validate(user);

            if (!string.IsNullOrEmpty(updateProfileReq.avatarUrl))
             {
             existingUser.AvatarUrl = updateProfileReq.avatarUrl;
             }

            if (!string.IsNullOrEmpty(updateProfileReq.username))
             {
             existingUser.Username = updateProfileReq.username;
             }
             if (!string.IsNullOrEmpty(updateProfileReq.about))
                {
                existingUser.About = updateProfileReq.about;
                }

            await _userRepository.UpdateUserAsync(id, existingUser);
            
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
        public async Task UnfriendAsync(string userId, string friendId){
            var user = await _userRepository.GetUserByIdAsync(userId); 
            if (user == null) {
                throw new NotFoundException($"User with ID '{userId}' not found."); 
            }
            user.Friends = user.Friends.Where(f=>f != friendId).ToArray();
            await _userRepository.UpdateUserAsync(userId, user); 
        
            }

        public async Task<List<User>> SearchUsersByFirstNameOrLastNameAsync(SearchRequest searchRequest)
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

    // Get the list of friends' IDs .

    var friendIds = currentUser.Friends; 

    if (friendIds == null || !friendIds.Any()) {
        return new List<User>();
    }

        var matchingFriends = await _userRepository.GetFriendsBySearchRequestAsync(friendIds, searchRequest.SearchReq); 
        return matchingFriends;
        }
    }
}