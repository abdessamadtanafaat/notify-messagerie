using NotificationService.Models;

public interface IFriendRepository {

    Task<List<Friends>> GetFriendsAsync(string userId, int pageNumber = 1, int pageSize = 6); 
    Task<List<string>> GetFriendsIdsAsync(string userId); 
    Task<List<string>> GetMutualFriendsAsync(string userId1, string userId2); 
    Task<Friends> GetFriendshipAsync(string userId, string friendId); 
    Task RemoveFriendshipAsync(string userId, string friendId); 
    Task<int> GetTotalFriendsCountAsync(string userId); 

    Task AddFriendshipAsync (Friends friendship); 


    
}