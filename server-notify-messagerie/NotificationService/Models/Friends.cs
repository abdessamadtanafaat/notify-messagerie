using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Friends
{
        [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id {get; set;}
    public string UserId { get; set; } // User ID
    public string FriendId { get; set; } // Friend ID
    public DateTime CreatedAt { get; set; } // Date when the friendship was created
    public int NbMutualFriends{get; set;}
    public List<String>? MutualFriends{get; set;}


        public Friends(
        string userId,
        string friendId,
        int nbMutualFriends,
        DateTime createdAt,
        List<String> mutualFriends
        )
    {
        UserId = userId; 
        FriendId = friendId; 
        CreatedAt = createdAt;
        NbMutualFriends = nbMutualFriends;
        MutualFriends = mutualFriends; 
    }

}
