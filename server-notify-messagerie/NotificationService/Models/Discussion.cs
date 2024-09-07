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
    public Boolean IsBlocked { get; set;} = false; 
    public Boolean IsArchived { get; set;} = false; 
    public Boolean IsPinned { get; set;} = false; 


        // Constructor with validation
    public Discussion(
        string id,
        List<string> participants,
        DateTime lastMessageTimestamp,
        string lastMessageContent,
        Boolean isArchived, 
        Boolean isBlocked,
        Boolean isPinned
        )
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        Participants = participants ?? throw new ArgumentNullException(nameof(participants));
        LastMessageTimestamp = lastMessageTimestamp;
        LastMessageContent = lastMessageContent ?? throw new ArgumentNullException(nameof(lastMessageContent));
        IsArchived = isArchived; 
        IsBlocked = isBlocked;
        IsPinned = isPinned; 
    }
    
}