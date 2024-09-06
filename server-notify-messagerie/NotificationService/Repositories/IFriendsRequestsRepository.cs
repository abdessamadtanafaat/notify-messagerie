public interface IFriendsRequestsRepository {

    Task<List<FriendRequests>> GetfriendsRequestsAsync(string userId, int pageNumber = 1, int pageSize = 10); 
    Task RemoveFriendRequestAsync(string friendId, string userId);
}