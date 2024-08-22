using MongoDB.Bson;
using MongoDB.Driver;

namespace NotificationService.Repositories
{

public class MessageRepository : IMessageRepostory {

        private readonly IMongoCollection<Message> _message;

        public MessageRepository(MongoDbContext context)
        {
            _message = context.Message;
        }

    public async Task SaveMessageAsync(Message message)
    {

        var messageDto = new Message 
        {
            SenderId = message.SenderId,
            FirstName = message.FirstName,
            LastName = message.LastName,
            ReceiverId = message.ReceiverId,
            Content = message.Content,
            Timestamp = message.Timestamp,
            Read = message.Read, 
        };

        await _message.InsertOneAsync(message); 

    }

            public async Task<IEnumerable<Message>> GetMessagesForUser(string userId)
        {
            // Define filter to find messages where the user is either sender or receiver
            var filter = Builders<Message>.Filter.Eq(m => m.SenderId, userId) |
                         Builders<Message>.Filter.Eq(m => m.ReceiverId, userId);

            // Retrieve messages based on the filter and sort them by timestamp
            var messages = await _message.Find(filter)
                                         .SortBy(m => m.Timestamp)
                                         .ToListAsync();

            return messages;
        }

public async Task<IEnumerable<Message>> GetMessagesForDiscussion(string discussionId, DateTime? cursor, int limit)
{
    var filterBuilder = Builders<Message>.Filter;
    var filter = filterBuilder.Eq(m => m.DiscussionId, discussionId);

    if (cursor.HasValue)
    {
        filter = filter & filterBuilder.Lt(m => m.Timestamp, cursor.Value);
    }

    var query = _message.Find(filter)
                        .SortByDescending(m => m.Timestamp)
                        .Limit(limit);

    return await query.ToListAsync();
}



        public async Task UpdateMessageAsync(string IdMessage, Message message)
    {
            var objectId = new ObjectId(IdMessage); 
            await _message.ReplaceOneAsync(d => d.Id == IdMessage, message);
    }

        public async Task<Message> GetMessageByIdAsync(string messageId)
    {
        var filter = Builders<Message>.Filter.Eq(msg => msg.Id, messageId);
        
        var message = await _message.Find(filter).FirstOrDefaultAsync();

        return message;
    }

    }



}