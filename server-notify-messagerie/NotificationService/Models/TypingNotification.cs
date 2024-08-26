using System.Text.Json.Serialization;

public class TypingNotification
{
    [JsonPropertyName("type")]
    public string Type { get; set; } // Should be 'typing' for typing notifications

    [JsonPropertyName("discussionId")]
    public string DiscussionId { get; set; }
    
    [JsonPropertyName("senderId")]
    public string SenderId { get; set; }

    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; }

        // Constructor with validation
    public TypingNotification(
        string type,
        string discussionId,
        string senderId,
        string receiverId)
    {
        Type = type ?? throw new ArgumentNullException(nameof(type));
        DiscussionId = discussionId ?? throw new ArgumentNullException(nameof(discussionId));
        SenderId = senderId ?? throw new ArgumentNullException(nameof(senderId));
        ReceiverId = receiverId ?? throw new ArgumentNullException(nameof(receiverId));
    }
    
}