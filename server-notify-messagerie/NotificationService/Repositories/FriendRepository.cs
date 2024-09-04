using MongoDB.Driver;
using NotificationService;
using NotificationService.Exceptions;
using NotificationService.Models;

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

    public async Task<Friends> GetFriendshipAsync(string userId, string friendId)
{
    return await _friend
        .Find(f => f.UserId == userId && f.FriendId == friendId)
        .FirstOrDefaultAsync();
}

    public async Task RemoveFriendshipAsync(string userId, string friendId) {
        var filter = Builders<Friends>.Filter.And (
            Builders<Friends>.Filter.Eq(f=> f.UserId, userId), 
            Builders<Friends>.Filter.Eq(f=> f.FriendId, friendId)
        ); 

        var result  = await _friend.DeleteOneAsync(filter);

        if (result.DeletedCount == 0 ) {
                        throw new NotFoundException("Friendship not found or already removed.");
        }
    }
    public async Task<int> GetTotalFriendsCountAsync(string userId)
    {
        // Count the total number of friends where the userId is either in the UserId field or in the FriendId field
        var filter = Builders<Friends>.Filter.Or(
            Builders<Friends>.Filter.Eq(f => f.UserId, userId),
            Builders<Friends>.Filter.Eq(f => f.FriendId, userId)
        );

        var count = await _friend.CountDocumentsAsync(filter);
        return (int)count;
    }

    public async Task AddFriendshipAsync (Friends friendship)
    {
        try {

        await _friend.InsertOneAsync(friendship); 
        }

            catch (Exception ex)
    {
        // Handle exceptions here, e.g., log the error
        throw new Exception("Error adding friendship to the collection", ex);
    }
    
    }
}