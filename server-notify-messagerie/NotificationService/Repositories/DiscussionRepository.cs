using MongoDB.Bson;
using MongoDB.Driver;
using NotificationService;

public class DiscussionRepository : IDiscussionRepository
{


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

        var filterUserId = Builders<Discussion>.Filter.AnyEq(d => d.Participants, userId);
        var filterSelectedUserId = Builders<Discussion>.Filter.AnyEq(d => d.Participants, selectedUserId);

        var combinedFilter = Builders<Discussion>.Filter.And(filterUserId, filterSelectedUserId);

        var discussion = await _discussions.Find(combinedFilter).FirstOrDefaultAsync();

        Console.WriteLine($"Discussion Found : {discussion}");

        return discussion;

    }

    public async Task<IEnumerable<Discussion>> GetDiscussionsForUser(string userId, int pageNumber, int pageSize)
    {
        // Validate inputs
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
        }

        // Create the filter to find discussions where the userId is the first item in the Participants array
        var filter = Builders<Discussion>.Filter.And(
            Builders<Discussion>.Filter.Eq("Participants.0", userId), // Check if userId is the first item in Participants
            Builders<Discussion>.Filter.Eq(d => d.IsArchived, false)  // Ensure the discussion is not archived

        );

        // Create pagination options
        var skip = (pageNumber - 1) * pageSize;
        var limit = pageSize;
        // Create a sort definition to sort discussions by LastMessageTimestamp in descending order
        var sort = Builders<Discussion>.Sort
                    .Descending(d => d.IsPinned)  // Pinned discussions come first
                    .Descending(d => d.LastMessageTimestamp);

        // Fetch the discussions from the database
        var discussions = await _discussions
                .Find(filter)
                .Sort(sort)
                .Skip(skip)
                .Limit(limit)
                .ToListAsync();

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

            public async Task DeleteDiscussionAsync(string id)
        {
            await _discussions.DeleteOneAsync(u => u.Id == id);
        }
}