public interface IFriendRepository {

    Task<List<Friends>> GetFriendsAsync(string userId, int pageNumber = 1, int pageSize = 6); 
    Task<List<string>> GetFriendsIdsAsync(string userId); 
    Task<List<string>> GetMutualFriendsAsync(string userId1, string userId2); 
    
}