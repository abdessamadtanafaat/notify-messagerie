using System.Text;
using System.Net.WebSockets;
using System.Text.Json;
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
        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!result.CloseStatus.HasValue)
        {
            var messageJson = Encoding.UTF8.GetString(buffer, 0, result.Count);
            Console.WriteLine($"Received message: {messageJson}");

            try
            {
                // Handle typing notifications
                // if (IsTypingNotification(messageJson))
                // {
                //     var typingNotification = MapTypingCamelCaseToPascalCase<TypingNotification>(messageJson);

                //     if (typingNotification == null)
                //     {
                //         Console.WriteLine("Failed to deserialize TypingNotification.");
                //         continue;
                //     }

                //     Console.WriteLine($"Typing Notification: UserId = {typingNotification.UserId}");

                //     // Skip sending typing notification to the sender
                //     if (_userConnections.TryGetValue(typingNotification.UserId, out var receiverSocket))
                //     {
                //         Console.WriteLine($"User {typingNotification.UserId} is connected.");
                //         var responseMessage = Encoding.UTF8.GetBytes(messageJson);
                //         await receiverSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
                //         Console.WriteLine($"Typing notification sent to User {typingNotification.UserId}");
                //     }
                //     else
                //     {
                //         Console.WriteLine($"User {typingNotification.UserId} is not connected.");
                //     }

                //     continue;
                // }

                // Handle regular messages
                var message = MapCamelCaseToUpperCase(messageJson);

                if (message != null)
                {
                        // Save message and update discussion
                        await _messageService.SendMessage(message);
                        await _discussionService.UpdateDiscussion(message.DiscussionId, message);

                    // Route message to the intended recipient
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
                else
                {
                    Console.WriteLine("Deserialization returned null");
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

            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        _userConnections.TryRemove(userId, out _);
        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }

    // private bool IsTypingNotification(string json)
    // {
    //     try
    //     {
    //         var jsonDoc = JsonDocument.Parse(json);
    //         return jsonDoc.RootElement.GetProperty("type").GetString() == "typing";
    //     }
    //     catch
    //     {
    //         return false;
    //     }
    // }

    public Message MapCamelCaseToUpperCase(string json)
    {
        var dictionary = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);

        var mappedDictionary = new Dictionary<string, JsonElement>();

        foreach (var kvp in dictionary)
        {
            var key = kvp.Key switch
            {
                "discussionId" => "DiscussionId",
                "senderId" => "SenderId",
                "receiverId" => "ReceiverId",
                "content" => "Content",
                "timestamp" => "Timestamp",
                "read" => "Read",
                _ => kvp.Key
            };

            mappedDictionary[key] = kvp.Value;
        }

        var mappedJson = JsonSerializer.Serialize(mappedDictionary);

        return JsonSerializer.Deserialize<Message>(mappedJson);
    }


    // private T MapTypingCamelCaseToPascalCase<T>(string json)
    // {
    //     var dictionary = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);
    //     var mappedDictionary = new Dictionary<string, JsonElement>();

    //     foreach (var kvp in dictionary)
    //     {
    //         var key = ToPascalCase(kvp.Key);
    //         mappedDictionary[key] = kvp.Value;
    //     }

    //     var mappedJson = JsonSerializer.Serialize(mappedDictionary);
    //     return JsonSerializer.Deserialize<T>(mappedJson);
    // }

//     private string ToPascalCase(string camelCase)
//     {
//         if (string.IsNullOrEmpty(camelCase))
//         {
//             return camelCase;
//         }

//         return char.ToUpper(camelCase[0]) + camelCase.Substring(1);
//     }
 }
