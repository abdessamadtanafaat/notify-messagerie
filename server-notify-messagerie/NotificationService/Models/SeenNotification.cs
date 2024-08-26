using System.Text.Json.Serialization;

public class SeenNotification
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "seen";
    [JsonPropertyName("discussionId")]
    public string DiscussionId { get; set; }

    [JsonPropertyName("messageId")]
    public string MessageId { get; set; }

    [JsonPropertyName("senderId")]
    public string SenderId { get; set; }

    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; }

    [JsonPropertyName("readTime")]
    public DateTime ReadTime { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("isSeen")]
    public bool IsSeen { get; set; } = true;

    // Constructor with validation
    public SeenNotification(
        string discussionId,
        string messageId,
        string senderId,
        string receiverId,
        DateTime readTime = default,
        bool isSeen = true)
    {
        DiscussionId = discussionId ?? throw new ArgumentNullException(nameof(discussionId));
        MessageId = messageId ?? throw new ArgumentNullException(nameof(messageId));
        SenderId = senderId ?? throw new ArgumentNullException(nameof(senderId));
        ReceiverId = receiverId ?? throw new ArgumentNullException(nameof(receiverId));
        ReadTime = readTime == default ? DateTime.UtcNow : readTime;
        IsSeen = isSeen;
    }
    
}
