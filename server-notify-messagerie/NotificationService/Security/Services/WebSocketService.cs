
using System.Text;
using System.Net.WebSockets;
using NotificationService.Security;
using System.Text.Json;


public class WebSocketService : IWebSocketService
{

    private readonly IMessageService _messageService;

    public WebSocketService(IMessageService messageService)
    {
        _messageService = messageService;
    }
        public async Task HandleWebSocketAsync(WebSocket webSocket) {
        var buffer = new byte[1024*8]; 
        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None); 
        
        while (!result.CloseStatus.HasValue)
        {
        var messageJson  = Encoding.UTF8.GetString(buffer,0,result.Count); 
        Console.WriteLine($"Received message: {messageJson }");

        try
        {
            var message = JsonSerializer.Deserialize<Message>(messageJson);

            // for debug and find errors
            if (message != null)
            {
                await _messageService.SendMessage(message);
                Console.WriteLine($"Message saved: {message.Id}");
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
        


        var response = Encoding.UTF8.GetBytes("Message Received");
        await webSocket.SendAsync(new ArraySegment<byte>(response), WebSocketMessageType.Text, true, CancellationToken.None);

        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        }
        await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription,CancellationToken.None);
    }
}