using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

public class FriendRequests
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("status")]
    public string Status { get; set; }

    [BsonElement("ReceiverId")]
    public string ReceiverId { get; set; }

    [BsonElement("SenderId")]
    public string SenderId { get; set; }

    [BsonElement("SentAt")]
    public DateTime SentAt { get; set; }

    [BsonElement("MutualFriends")]
    public string[] MutualFriends { get; set; }

    [BsonElement("NbMutualFriends")]
    public int NbMutualFriends { get; set; }

    // Parameterless constructor is required for MongoDB deserialization
    public FriendRequests() { }

    // Constructor to initialize properties
    public FriendRequests(string id, string status, string receiverId, string senderId, DateTime sentAt, string[] mutualFriends, int nbMutualFriends)
    {
        Id = id;
        Status = status;
        ReceiverId = receiverId;
        SenderId = senderId;
        SentAt = sentAt;
        MutualFriends = mutualFriends;
        NbMutualFriends = nbMutualFriends;
    }
}
