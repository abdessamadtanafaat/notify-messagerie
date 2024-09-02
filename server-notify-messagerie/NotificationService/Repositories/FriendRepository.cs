using MongoDB.Driver;
using NotificationService;

public class FriendReporsitory : IFriendRepository {


    private readonly IMongoCollection<Friends> _friend;

    public FriendReporsitory(MongoDbContext context)
        {
            _friend = context.Friend;
        }

    // Get friends for a user
    public async Task<List<Friends>> GetFriendsAsync(string userId, int pageNumber, int pageSize = 6)
    {
    var skip = (pageNumber - 1) * pageSize;
    return await _friend
        .Find(f => f.UserId == userId)
        .SortBy(f => f.CreatedAt)
        .Skip(skip)
        .Limit(pageSize)
        .ToListAsync();
    }

public async Task<List<string>> GetFriendsIdsAsync(string userId)
{
    var friends = await _friend
        .Find(f => f.UserId == userId)
        .Project(f => f.FriendId)  
        .ToListAsync();           
    return friends;
}


        public async Task<List<string>> GetMutualFriendsAsync(string userId1, string userId2)
    {
        // Get friend IDs for both users
        var friendsUser1 = await GetFriendsIdsAsync(userId1);
        var friendsUser2 = await GetFriendsIdsAsync(userId2);

        // Find mutual friends by intersecting the two lists
        var mutualFriends = friendsUser1.Intersect(friendsUser2).ToList();

        return mutualFriends;
    }


}