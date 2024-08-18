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

        public async Task<IEnumerable<Message>> GetMessagesForDiscussion(string discussionId)
        {

        return await _message.Find(m => m.DiscussionId == discussionId)
                               .SortBy(m => m.Timestamp)
                               .ToListAsync();
    

        }
        public async Task UpdateMessageAsync(string IdMessage, Message message)
    {
            var objectId = new ObjectId(IdMessage); 
            await _message.ReplaceOneAsync(d => d.Id == IdMessage, message);
    }
    }



}