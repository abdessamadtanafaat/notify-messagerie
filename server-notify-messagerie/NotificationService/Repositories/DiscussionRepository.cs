using MongoDB.Bson;
using MongoDB.Driver;
using NotificationService;

public class DiscussionRepository : IDiscussionRepository{


        private readonly IMongoCollection<Discussion> _discussions;



    public DiscussionRepository(MongoDbContext context)
        {
            _discussions = context.Discussion;
        }

    public async Task<Discussion> GetDiscussionForTwoUsers(string userId, string selectedUserId)
    {
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
    }

        if (string.IsNullOrWhiteSpace(selectedUserId))
    {
        throw new ArgumentException("selected User Id  cannot be null or empty", nameof(selectedUserId));
    }

        var filterUserId = Builders<Discussion>.Filter.AnyEq(d=> d.Participants, userId); 
        var filterSelectedUserId = Builders<Discussion>.Filter.AnyEq(d=> d.Participants, selectedUserId);

        var combinedFilter = Builders<Discussion>.Filter.And(filterUserId, filterSelectedUserId); 

        var discussion = await _discussions.Find(combinedFilter).FirstOrDefaultAsync();

        Console.WriteLine($"Discussion Found : {discussion}");

        return discussion; 
    
        }

    public async Task<IEnumerable<Discussion>> GetDiscussionsForUser(string userId)
{
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
    }

    // Execute the query
    var filter = Builders<Discussion>.Filter.AnyEq(d => d.Participants, userId);
    var sort = Builders<Discussion>.Sort.Descending(d => d.LastMessageTimestamp);
    var discussions = await _discussions.Find(filter).Sort(sort).ToListAsync();

    // Log the results
    Console.WriteLine($"Discussions found: {discussions.Count}");

    return discussions;
}

    public async Task UpdateDiscussionAsync(string IdDiscussion, Discussion discussion)
    {
            var objectId = new ObjectId(IdDiscussion); 
            await _discussions.ReplaceOneAsync(d => d.Id == IdDiscussion, discussion);
    }

    public async Task<Discussion> GetDiscussionByIdAsync(string id)
    {
                return await _discussions.Find(d => d.Id == id).FirstOrDefaultAsync();
    }

}