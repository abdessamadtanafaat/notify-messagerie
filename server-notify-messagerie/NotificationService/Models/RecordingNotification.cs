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
}