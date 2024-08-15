
using System.Text;
using System.Net.WebSockets;
using NotificationService.Security;
using System.Text.Json;
using System.Collections.Concurrent;


public class WebSocketService : IWebSocketService
{

    private readonly IMessageService _messageService;
    private readonly IDiscussionService _discussionService;

    public WebSocketService(IMessageService messageService, IDiscussionService discussionService)
    {
        _messageService = messageService;
        _discussionService = discussionService; 
        
    }
        private readonly ConcurrentDictionary<string, WebSocket> _userConnections = new ConcurrentDictionary<string, WebSocket>();    
        public async Task HandleWebSocketAsync(WebSocket webSocket, string userId) {

        _userConnections[userId] = webSocket;
        var buffer = new byte[1024*8]; 
        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None); 
        
        while (!result.CloseStatus.HasValue)
        {
        var messageJson  = Encoding.UTF8.GetString(buffer,0,result.Count); 
        Console.WriteLine($"Received message: {messageJson }");

        try
        {
            var message = MapCamelCaseToUpperCase(messageJson);

            // for debug and find errors
            if (message != null)
            {
                    // Route message to the intended recipient
                    if (_userConnections.TryGetValue(message.ReceiverId, out var receiverSocket))
                    {
                        var responseMessage = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
                        await receiverSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
                    }

                    Console.WriteLine($"Message sent to other user: {message.ReceiverId}");

                await _messageService.SendMessage(message);
                await _discussionService.UpdateDiscussion(message.DiscussionId, message);

                Console.WriteLine($"Message saved in the database: {message.Id}");
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
        


        // Send JSON response
        // var response = JsonSerializer.Serialize(new { status = "success", message = "Message Received" });
        // var responseBytes = Encoding.UTF8.GetBytes(response);
        // await webSocket.SendAsync(new ArraySegment<byte>(responseBytes), WebSocketMessageType.Text, true, CancellationToken.None);

        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        }
        _userConnections.TryRemove(userId, out _);
        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription,CancellationToken.None);
    }

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

}