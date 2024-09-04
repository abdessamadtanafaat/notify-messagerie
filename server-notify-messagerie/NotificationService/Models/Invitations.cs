using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Invitations
{
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("MutualFriends")]
    public List<string> MutualFriends { get; set; } = new List<string>();

    [BsonElement("NbMutualFriends")]
    public int NbMutualFriends { get; set; }

    [BsonElement("ReceiverId")]
    public string ReceiverId { get; set; }

    [BsonElement("SenderId")]
    public string SenderId { get; set; }

    [BsonElement("SentAt")]
    public DateTime SentAt { get; set; }

    [BsonElement("Status")]
    public string Status { get; set; }

    // Constructor
    public Invitations(ObjectId id, List<string> mutualFriends, int nbMutualFriends, string receiverId, string senderId, DateTime sentAt, string status)
    {
        Id = id;
        MutualFriends = mutualFriends;
        NbMutualFriends = nbMutualFriends;
        ReceiverId = receiverId;
        SenderId = senderId;
        SentAt = sentAt;
        Status = status;
    }
}
