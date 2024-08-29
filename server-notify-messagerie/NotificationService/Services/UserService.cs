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

        public UserService(IUserRepository userRepository, IUserValidators userValidators)
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
       
        public async Task<IEnumerable<User>> GetFriendsAsync(string userId, int pageNumber=1, int pageSize=6)
        {
            if (string.IsNullOrWhiteSpace(userId)) {
                    throw new ArgumentNullException("User ID cannot be empty or whitespace."); 
            } 
            var user = await _userRepository.GetUserByIdAsync(userId); 
            if (user == null) {
                throw new NotFoundException ($"User With ID '{userId}' not found."); 
            }
            if (user.Friends == null){
                return Enumerable.Empty<User>();
            }
            var friendsIds = user.Friends; 
            var totalFriends = friendsIds.Count; 

            if (pageNumber < 1)
            {
                pageNumber = 1; 
            } 
            if (pageSize < 1) {
                pageSize = 1; 
            }
            var skip = (pageNumber - 1 ) * pageSize;

            if (skip >= totalFriends) {
                return Enumerable.Empty<User>(); 
            }

            var friendTasks = friendsIds
                                .Skip(skip)
                                .Take(pageSize)
                                .Select(friendId => _userRepository.GetUserByIdAsync(friendId)).ToArray();
            var friends = await Task.WhenAll(friendTasks); 

            // var friendTasks = user.Friends.Select(friendId => _userRepository.GetUserByIdAsync(friendId)).ToArray(); 
            // var friends = await Task.WhenAll(friendTasks); 

                        var sortedFriends = friends
                .OrderBy(u=> string.IsNullOrWhiteSpace(u.FirstName)? ' ' : u.FirstName.ToUpper()[0])
                .ToList();

            // in case some friend id do not correspond to existing users.
            return sortedFriends.Where(friend=> friend != null); 
        }
        public async Task<IEnumerable<User>> GetCommonFriendsAsync(string userId, string friendId) {

            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(friendId)) {
                    throw new ArgumentNullException("User or Friend ID cannot be empty or whitespace."); 
            } 
            var user = await _userRepository.GetUserByIdAsync(userId); 
            var friend = await _userRepository.GetUserByIdAsync(friendId); 
            if (user == null || friend == null ) {
                throw new NotFoundException ($"User With ID not found."); 
            }

            var userFriends = user.Friends ?? new List<string>(); 
            var friendFriends = friend.Friends ?? new List<string>();


            var commonFriendsIds = userFriends.Intersect(friendFriends);

            var commonFriends = new List<User>(); 

            foreach (var commonFriendId in commonFriendsIds) {

                var commonFriend = await _userRepository.GetUserByIdAsync(commonFriendId); 

                if (commonFriend != null) {
                    commonFriends.Add(commonFriend);
                }
            }

            var sortedCommonFriends = commonFriends
                .OrderBy(u=> string.IsNullOrWhiteSpace(u.FirstName)? ' ' : u.FirstName.ToUpper()[0])
                .ToList();

            return sortedCommonFriends;

        }

        
        public async Task UnfriendAsync(string userId, string friendId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            var friend = await _userRepository.GetUserByIdAsync(friendId);

            if (user == null || friend == null)
            {
                throw new NotFoundException($"User Or Friend not found.");
            }

            if (user.Friends == null)
            {
                user.Friends = new List<string>();
            }

            if (user.Friends.Contains(friendId))
            {
                user.Friends.Remove(friendId);
            }
            await _userRepository.UpdateUserAsync(userId, user);
        }

        public async Task AddFriendAsync(string userId, string friendId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            var friend = await _userRepository.GetUserByIdAsync(friendId);

            if (user == null)
            {
                throw new NotFoundException($"User with ID '{userId}' not found");
            }
            if (friend == null)
            {
                throw new NotFoundException($"User with ID '{userId}' not found");
            }

            if (user.FriendRequestsSent == null)
            {
                user.FriendRequestsSent = new List<string>();
            }
            if (!user.FriendRequestsSent.Contains(friendId))
            {
                user.FriendRequestsSent.Add(friendId);
            }

            if (friend.FriendRequestsReceived == null)
            {
                friend.FriendRequestsReceived = new List<string>();
            }
            if (!friend.FriendRequestsReceived.Contains(userId))
            {
                friend.FriendRequestsReceived.Add(userId);
            }

            await _userRepository.UpdateUserAsync(userId, user);
            await _userRepository.UpdateUserAsync(friendId, friend);
        }

        public async Task<string> AnswerInvitationAsync(string userId, string friendId, AnswerInvitationRequest.InvitationResponse answerInvitation)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                throw new NotFoundException($"User with ID '{userId}' Not found");
            }
            var friend = await _userRepository.GetUserByIdAsync(friendId);
            if (friend == null)
            {
                throw new NotFoundException($"User with ID '{friendId}' Not found");
            }


            if (user.Friends == null)
            {
                user.Friends = new List<string>();
            }

            if (friend.Friends == null)
            {
                friend.Friends = new List<string>();
            }

            if (user.FriendRequestsReceived == null)
            {
                user.FriendRequestsReceived = new List<string>();
            }

            switch (answerInvitation)
            {
                case AnswerInvitationRequest.InvitationResponse.Accepted:

                    if (user.FriendRequestsReceived.Contains(friendId))
                    {
                        user.FriendRequestsReceived.Remove(friendId);
                        user.Friends.Add(friendId);
                        friend.Friends.Add(userId);
                        await _userRepository.UpdateUserAsync(userId, user);
                        await _userRepository.UpdateUserAsync(friendId, friend);
                        return "You accepted the Invitation.";
                    }
                    break;

                case AnswerInvitationRequest.InvitationResponse.rejected:
                    if (user.FriendRequestsReceived.Contains(friendId))
                    {
                        user.FriendRequestsReceived.Remove(friendId);
                        await _userRepository.UpdateUserAsync(userId, user);
                        await _userRepository.UpdateUserAsync(friendId, friend);
                        return "You rejected the Invitation.";
                    }
                    break;
            }


            return "Null";
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

            if (friendIds == null || !friendIds.Any())
            {
                return new List<User>();
            }

            var friendIdsArray = friendIds.ToArray();
            var matchingFriends = await _userRepository.GetFriendsBySearchRequestAsync(friendIdsArray, searchRequest.SearchReq);
            return matchingFriends;
        }
    }
}