using MongoDB.Driver;
using NotificationService.Models;

namespace NotificationService
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<Message> Message => _database.GetCollection<Message>("Message");
        public IMongoCollection<Discussion> Discussion => _database.GetCollection<Discussion>("Discussions");
        public IMongoCollection<Friends> Friend => _database.GetCollection<Friends>("Friends");
        public IMongoCollection<Invitations> Invitations => _database.GetCollection<Invitations>("Invitations");
        public IMongoCollection<FriendRequests> FriendRequests => _database.GetCollection<FriendRequests>("FriendRequests");


    }
}