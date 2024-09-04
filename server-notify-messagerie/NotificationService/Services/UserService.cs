using MongoDB.Bson;
using MongoDB.Driver;
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
        private readonly IFriendRepository _friendRepository;
        private readonly IInvitationsRepository _invitationsRepository; 
        public UserService(IUserRepository userRepository,
                           IUserValidators userValidators,
                           IFriendRepository friendRepository,
                           IInvitationsRepository invitationsRepository
                           )
        {
            _userRepository = userRepository;
            _userValidators = userValidators;
            _friendRepository = friendRepository;
            _invitationsRepository =  invitationsRepository; 
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
        public async Task<IEnumerable<MyFriends>> GetFriendsAsync(string userId, int pageNumber, int pageSize)
        {
            if (string.IsNullOrWhiteSpace(userId)) {
                throw new ArgumentNullException("User ID cannot be empty or whitespace."); 
            } 
            var user = await _userRepository.GetUserByIdAsync(userId); 
            if (user == null) {
                throw new NotFoundException ($"User With ID '{userId}' not found."); 
            }


    // Fetch the friends from the repository
    var friendDocuments = await _friendRepository.GetFriendsAsync(userId, pageNumber, pageSize);


    // Extract friend IDs
    var friendIds = friendDocuments.Select(f => f.FriendId).ToList();

    // Retrieve user details for friend IDs
    var friendUsers = await _userRepository.GetUsersByIdsAsync(friendIds);

    // Combine friend details and other information into MyFriends objects
    var myFriendsList = friendDocuments.Select(friendDoc =>
    {
        var friendUser = friendUsers.FirstOrDefault(u => u.Id == friendDoc.FriendId);

        return new MyFriends
        {
            User = friendUser,
            CreatedAt = friendDoc.CreatedAt,
            NbMutualFriends = friendDoc.NbMutualFriends,
            MutualFriends = friendDoc.MutualFriends
        };
    }).ToList();


    return myFriendsList;
}

        public async Task<IEnumerable<User>> GetMutualFriendsAsync(string userId, string friendId) {

        var mutualFriendIds = await _friendRepository.GetMutualFriendsAsync(userId, friendId);
        
        // Fetch user details for the mutual friend IDs
        var mutualFriends = await _userRepository.GetUsersByIdsAsync(mutualFriendIds);
        
        return mutualFriends;

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

            user.NbFriends--; 
                
            await _friendRepository.RemoveFriendshipAsync(userId, friendId); 
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

        public async Task<MyFriends> AnswerInvitationAsync(string userId, string friendId, AnswerInvitationRequest.InvitationResponse answerInvitation)
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
                        user.NbInvitations--; 
                        user.NbFriends++;  
                        // Update users in the User collection
                        await _userRepository.UpdateUserAsync(userId, user);
                        await _userRepository.UpdateUserAsync(friendId, friend);

                        // Get mutual friends 
                        var mutualFriends =  await _friendRepository.GetMutualFriendsAsync(userId, friendId); 
                        var mutualFriendsCount = mutualFriends.Count; 

                    var userFriendShip = new Friends
                         {
                    UserId = userId,
                    FriendId = friendId,
                    CreatedAt = DateTime.UtcNow,
                    NbMutualFriends = mutualFriendsCount,
                    MutualFriends = mutualFriends
                         }; 
                        // complete here the acceptation . 
                        
                var friendFriendship = new Friends
                {
                    UserId = friendId,
                    FriendId = userId,
                    CreatedAt = DateTime.UtcNow,
                    NbMutualFriends = mutualFriendsCount,
                    MutualFriends = mutualFriends
                };
                                // Add friendships to the Friends collection
                await _friendRepository.AddFriendshipAsync(userFriendShip);
                await _friendRepository.AddFriendshipAsync(friendFriendship);


                                // Remove invitation after acceptance
                await _invitationsRepository.RemoveInvitationAsync(friendId, userId);

                // Create and return MyFriends object for the accepted friend
                var myFriend = new MyFriends
                {
                    User = friend,
                    CreatedAt = DateTime.UtcNow,
                    NbMutualFriends = mutualFriendsCount,
                    MutualFriends = mutualFriends
                };

                return myFriend;

                    }
                    break;

                case AnswerInvitationRequest.InvitationResponse.rejected:
                    if (user.FriendRequestsReceived.Contains(friendId))
                    {
                        user.FriendRequestsReceived.Remove(friendId);
                        await _userRepository.UpdateUserAsync(userId, user);
                        user.NbInvitations--; 
                        await _userRepository.UpdateUserAsync(friendId, friend);

                // Remove invitation after rejection
                await _invitationsRepository.RemoveInvitationAsync(friendId, userId);
                return new MyFriends(); // Return an empty MyFriends object
                        //return "You rejected the Invitation.";
                    }
                    break;
            }


            return null ;
        }

        public async Task<List<MyFriends>> SearchUsersByFirstNameOrLastNameAsync(SearchRequest searchRequest, int pageNumber, int pageSize)
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
                return new List<MyFriends>();
            }

            var friendIdsArray = friendIds.ToArray();
            var matchingUsers = await _userRepository.GetFriendsBySearchRequestAsync(friendIdsArray.ToArray(),
                                                                                     searchRequest.SearchReq,
                                                                                    pageNumber,
                                                                                    pageSize);

    var myFriendsList = new List<MyFriends>();



    // Get friend documents for matching users
    var friendDocuments = await _friendRepository.GetFriendsAsync(searchRequest.UserId, 1, int.MaxValue); // Retrieve all friend documents for the user

    foreach (var user in matchingUsers)
    {
        
        var friendDoc = await _friendRepository.GetFriendshipAsync(searchRequest.UserId, user.Id);

        if (friendDoc != null)
        {
            var mutualFriendsIds = await _friendRepository.GetMutualFriendsAsync(searchRequest.UserId, user.Id.ToString());
            var nbMutualFriends = mutualFriendsIds.Count;

            var myFriend = new MyFriends
            {
                User = user,
                CreatedAt = friendDoc.CreatedAt,
                NbMutualFriends = nbMutualFriends,
                MutualFriends = mutualFriendsIds
            };

            myFriendsList.Add(myFriend);
        }
    }

    return myFriendsList;
   
        }
    
        public async Task<IEnumerable<MyInvitations>> GetInvitationsFriends(string userId, int pageNumber=1, int pageSize=6) {

                        if (string.IsNullOrWhiteSpace(userId)) {
                throw new ArgumentNullException("User ID cannot be empty or whitespace."); 
            } 
            var user = await _userRepository.GetUserByIdAsync(userId); 
            if (user == null) {
                throw new NotFoundException ($"User With ID '{userId}' not found."); 
            }


    var invitationsDocuments = await _invitationsRepository.GetInvitationsAsync(userId, pageNumber, pageSize);


    var invitationsSendersIds = invitationsDocuments.Select(f => f.SenderId).ToList();

    var invitationsUsers = await _userRepository.GetUsersByIdsAsync(invitationsSendersIds);

    var myInvitationsList = invitationsDocuments.Select(invitationDoc =>
    {
        var InvitationUser = invitationsUsers.FirstOrDefault(i => i.Id == invitationDoc.SenderId);

        return new MyInvitations
        {
            User = InvitationUser,
            SentAt = invitationDoc.SentAt,
            MutualFriends = invitationDoc.MutualFriends,
            Status = invitationDoc.Status,
            NbMutualFriends = invitationDoc.NbMutualFriends,
        };
    }).ToList();

    return myInvitationsList;

        }

    }
}