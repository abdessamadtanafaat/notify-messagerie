using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using NotificationService.Models;

public class Discussion {

    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id {get; set;}
    public List<string> Participants { get; set; }
    public DateTime LastMessageTimestamp { get; set; }
    public string LastMessageContent { get; set;}
}