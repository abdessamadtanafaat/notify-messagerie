using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class Message {

    
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string DiscussionId { get; set; }
    public string SenderId { get; set; }
    public string ReceiverId { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public Boolean Read {get; set;}
    public DateTime ReadTime { get; set; }


}