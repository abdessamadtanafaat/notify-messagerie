using MongoDB.Driver;
using NotificationService;

public class FriendsRequestsRepository : IFriendsRequestsRepository
{

    private readonly IMongoCollection<FriendRequests> _friendRequests;



    public FriendsRequestsRepository(MongoDbContext context)
    {
        _friendRequests = context.FriendRequests;
    }

        public async Task<List<FriendRequests>> GetfriendsRequestsAsync(string userId, int pageNumber = 1, int pageSize = 10)
    {
                var skip = (pageNumber - 1) * pageSize;
    return await _friendRequests
        .Find(i => i.SenderId == userId)
        .SortBy(i => i.SentAt)
        .Skip(skip)
        .Limit(pageSize)
        .ToListAsync();
    }
    
       public async Task RemoveFriendRequestAsync(string friendId, string userId)
    {
        try
        {

            var filter = Builders<FriendRequests>.Filter.Eq(req => req.SenderId, userId) &
                         Builders<FriendRequests>.Filter.Eq(req => req.ReceiverId, friendId);
            var result = await _friendRequests.DeleteOneAsync(filter);

            if (result.DeletedCount == 0)
            {
                throw new Exception("Friend Request not found or could not be deleted.");
            }
        }
        catch (Exception ex)
        {
            // Handle exceptions here, e.g., log the error
            throw new Exception("Error removing Friend Request from the collection", ex);
        }

    }


}