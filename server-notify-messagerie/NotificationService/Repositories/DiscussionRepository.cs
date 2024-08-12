using MongoDB.Bson;
using MongoDB.Driver;
using NotificationService;

public class DiscussionRepository : IDiscussionRepository{


        private readonly IMongoCollection<Discussion> _discussions;


    public DiscussionRepository(MongoDbContext context)
        {
            _discussions = context.Discussion;
        }

public async Task<IEnumerable<Discussion>> GetDiscussionsForUser(string userId)
{
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
    }

    // Execute the query
    var filter = Builders<Discussion>.Filter.AnyEq(d => d.Participants, userId);
    var discussions = await _discussions.Find(filter).ToListAsync();
    // Log the results
    Console.WriteLine($"Discussions found: {discussions.Count}");

    return discussions;
}



}