using System.Text.Json.Serialization;

public class RecordingNotification
{
    [JsonPropertyName("type")]
    public string Type { get; set; } // Should be 'recording' for recording notifications

    [JsonPropertyName("discussionId")]
    public string DiscussionId { get; set; }
    
    [JsonPropertyName("senderId")]
    public string SenderId { get; set; }

    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; }

        // Constructor with validation
    public RecordingNotification(
        string discussionId,
        string senderId,
        string receiverId)
    {
        Type = "recording"; // Setting default value for Type
        DiscussionId = discussionId ?? throw new ArgumentNullException(nameof(discussionId));
        SenderId = senderId ?? throw new ArgumentNullException(nameof(senderId));
        ReceiverId = receiverId ?? throw new ArgumentNullException(nameof(receiverId));
    }
    
}