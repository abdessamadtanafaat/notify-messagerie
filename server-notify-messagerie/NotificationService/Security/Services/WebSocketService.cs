using System.Text;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Threading;
using NotificationService.Security;

public class WebSocketService : IWebSocketService
{
    private readonly IMessageService _messageService;
    private readonly IDiscussionService _discussionService;
    private readonly ConcurrentDictionary<string, WebSocket> _userConnections = new ConcurrentDictionary<string, WebSocket>();

    public WebSocketService(IMessageService messageService, IDiscussionService discussionService)
    {
        _messageService = messageService;
        _discussionService = discussionService;
    }

    public async Task HandleWebSocketAsync(WebSocket webSocket, string userId)
    {
        _userConnections[userId] = webSocket;
        var buffer = new byte[1024 * 8];

        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }

                var messageJson = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received message: {messageJson}");

                try
                {
                    var jsonDoc = JsonDocument.Parse(messageJson);
                    if (jsonDoc.RootElement.TryGetProperty("type", out JsonElement typeElement))
                    {
                        var type = typeElement.GetString();
                        if (type == "typing")
                        {
                            var notification = JsonSerializer.Deserialize<TypingNotification>(messageJson);
                            if (notification != null)
                            {
                                await HandleTypingNotification(notification);
                            }
                        }

                        else if (type == "seen")
                        {
                            var seen = JsonSerializer.Deserialize<SeenNotification>(messageJson);
                            if (seen != null)
                            {
                                await HandleSeenNotification(seen);
                            }
                        }

                        else
                        {
                            var message = JsonSerializer.Deserialize<Message>(messageJson);
                            if (message != null)
                            {
                                await HandleMessage(message);
                            }
                        }
                    }
                    else
                    {
                        Console.WriteLine("Invalid message format: missing 'type' field.");
                    }
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"JsonException: {ex.Message}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}");
                }
            }
        }
        finally
        {
            _userConnections.TryRemove(userId, out _);
            if (webSocket.State == WebSocketState.Open)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the server", CancellationToken.None);
            }
        }
    }

    private async Task HandleTypingNotification(TypingNotification notification)
    {
        if (_userConnections.TryGetValue(notification.ReceiverId, out var receiverSocket))
        {
            var notificationJson = JsonSerializer.Serialize(notification);
            var responseMessage = Encoding.UTF8.GetBytes(notificationJson);
            await receiverSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine($"Typing notification sent to User {notification.ReceiverId}");
        }
        else
        {
            Console.WriteLine($"User {notification.ReceiverId} is not connected.");
        }
    }

    private async Task HandleMessage(Message message)
    {
        await _messageService.SendMessage(message);
        await _discussionService.UpdateDiscussion(message.DiscussionId, message);

        if (_userConnections.TryGetValue(message.ReceiverId, out var receiverSocket))
        {
            var responseMessage = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            await receiverSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine($"Message sent to User {message.ReceiverId}");
            Console.WriteLine($"Message saved in the database: {message.Id}");
        }
        else
        {
            Console.WriteLine($"User {message.ReceiverId} is not connected.");
        }
    }

    // HandleSeenNotification method to process seen notifications
private async Task HandleSeenNotification(SeenNotification notification)
{
    // Update the message status to "seen" in the database
    await _messageService.MarkMessageAsSeen(notification.MessageId, notification.ReceiverId);

    // Notify the sender that the message was seen
    if (_userConnections.TryGetValue(notification.ReceiverId, out var senderSocket))
    {
        var notificationJson = JsonSerializer.Serialize(notification);
        var responseMessage = Encoding.UTF8.GetBytes(notificationJson);
        await senderSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
        Console.WriteLine($"Seen notification sent to User {notification.ReceiverId}");
    }
    else
    {
        Console.WriteLine($"User {notification.SenderId} is not connected.");
    }
}

}