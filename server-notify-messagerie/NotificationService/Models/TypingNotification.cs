using System.Text.Json.Serialization;

public class TypingNotification
{
    [JsonPropertyName("type")]
    public string Type { get; set; } // Should be 'typing' for typing notifications

    [JsonPropertyName("senderId")]
    public string SenderId { get; set; }

    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; }
}