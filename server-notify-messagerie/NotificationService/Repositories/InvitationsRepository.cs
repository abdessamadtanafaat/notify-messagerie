
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
    public async Task RemoveInvitationAsync (string friendId,  string userId) 
    {
        try {

        var filter = Builders<Invitations>.Filter.Eq(inv=> inv.ReceiverId, userId) & 
                     Builders<Invitations>.Filter.Eq(inv => inv.SenderId, friendId); 
        var result = await _invitation.DeleteOneAsync(filter); 

        if (result.DeletedCount == 0)
        {
            throw new Exception("Invitation not found or could not be deleted.");
        }
    }
    catch (Exception ex)
    {
        // Handle exceptions here, e.g., log the error
        throw new Exception("Error removing invitation from the collection", ex);
    }

        }

}
