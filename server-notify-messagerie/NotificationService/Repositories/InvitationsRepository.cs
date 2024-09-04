
using MongoDB.Driver;
using NotificationService;

public class InvitationsRepository : IInvitationsRepository
{

    
    private readonly IMongoCollection<Invitations> _invitation;

    public InvitationsRepository(MongoDbContext context)
        {
            _invitation = context.Invitations;
        }

    public async Task<List<Invitations>> GetInvitationsAsync(string userId, int pageNumber = 1, int pageSize = 10)
    {
                var skip = (pageNumber - 1) * pageSize;
    return await _invitation
        .Find(i => i.ReceiverId == userId)
        .SortBy(i => i.SentAt)
        .Skip(skip)
        .Limit(pageSize)
        .ToListAsync();
    }
}