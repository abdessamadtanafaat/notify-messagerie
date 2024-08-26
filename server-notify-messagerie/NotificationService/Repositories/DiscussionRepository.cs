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

public async Task<IEnumerable<Discussion>> GetDiscussionsForUser(string userId, DateTime? cursor, int limit)
{
    // Validate inputs
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
    }

    if (limit <= 0)
    {
        throw new ArgumentException("Limit must be greater than zero", nameof(limit));
    }

    // Create filter for user participation
    var filter = Builders<Discussion>.Filter.AnyEq(d => d.Participants, userId);
    Console.WriteLine($"Base Filter: {filter.ToJson()}");

    // Add cursor-based filtering if cursor is provided
    if (cursor.HasValue)
    {
        var cursorFilter = Builders<Discussion>.Filter.Lt(d => d.LastMessageTimestamp, cursor.Value);
        filter = filter & cursorFilter;
        Console.WriteLine($"Combined Filter with Cursor: {filter.ToJson()}");
    }

    // Define the query
    var query = _discussions.Find(filter)
                             .SortByDescending(d => d.LastMessageTimestamp)
                             .Limit(limit);

    Console.WriteLine($"Query: {query.ToString()}");

    try
    {
        // Execute query and retrieve results
        var discussions = await query.ToListAsync();

        // Log results count and details
        Console.WriteLine($"Discussions found: {discussions.Count}");
        foreach (var discussion in discussions)
        {
            Console.WriteLine($"Discussion ID: {discussion.Id}");
            Console.WriteLine($"Participants: {string.Join(", ", discussion.Participants)}");
            Console.WriteLine($"Last Message Timestamp: {discussion.LastMessageTimestamp}");
        }

        return discussions;
    }
    catch (Exception ex)
    {
        // Log exception details
        Console.WriteLine($"Exception occurred: {ex.Message}");
        throw;
    }
}



// public async Task<IEnumerable<Message>> GetMessagesForDiscussion(string discussionId, DateTime? cursor, int limit)
// {
//     var filterBuilder = Builders<Message>.Filter;
//     var filter = filterBuilder.Eq(m => m.DiscussionId, discussionId);

//     if (cursor.HasValue)
//     {
//         filter = filter & filterBuilder.Lt(m => m.Timestamp, cursor.Value);
//     }

//     var query = _message.Find(filter)
//                         .SortByDescending(m => m.Timestamp)
//                         .Limit(limit);

//     return await query.ToListAsync();
// }


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