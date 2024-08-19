using System.Text.Json.Serialization;

public class SeenNotification
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "seen";

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

}
