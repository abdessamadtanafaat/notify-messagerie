using System.Text;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using System.Threading;
using NotificationService.Security;
using Microsoft.AspNetCore.Http;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;


public class WebSocketService : IWebSocketService
{
    private readonly IMessageService _messageService;
    private readonly IDiscussionService _discussionService;
    private readonly ConcurrentDictionary<string, WebSocket> _userConnections = new ConcurrentDictionary<string, WebSocket>();
    private readonly Cloudinary _cloudinary;


    public WebSocketService(IMessageService messageService,
     IDiscussionService discussionService,
         Cloudinary cloudinary
     )
    {
        _messageService = messageService;
        _discussionService = discussionService;
        _cloudinary = cloudinary;

    }

    public async Task HandleWebSocketAsync(WebSocket webSocket, string userId)
    {
        _userConnections[userId] = webSocket;
            Console.WriteLine($"WebSocket added for user {userId}");
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

                        else if (type == "recording")
                        {
                            var recording = JsonSerializer.Deserialize<RecordingNotification>(messageJson);
                            if (recording != null)
                            {
                                await HandleRecordingNotification(recording);
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

    private async Task HandleMessage(Message message, IFormFile audioFile = null)
    {

        if (message.Type == "audio" && audioFile != null) {
            string audioFilePath = await SaveAudioFile(audioFile); 
            message.Content = audioFilePath;
        }
        await _messageService.SendMessage(message);
        await _discussionService.UpdateDiscussion(message.DiscussionId, message);

        if (_userConnections.TryGetValue(message.ReceiverId, out var receiverSocket))
        {
                    Console.WriteLine($"Sending message to user {message.ReceiverId}");
            var responseMessage = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            await receiverSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine($"Message sent to User {message.ReceiverId}");
            Console.WriteLine($"Message saved in the database: {message.Id}");
        }
        else
        {
        Console.WriteLine($"User {message.ReceiverId} is not connected. Connection count: {_userConnections.Count}");
        }
    }

public async Task<string> SaveAudioFile(IFormFile audioFile)
{
    var uploadParams = new VideoUploadParams
    {
        File = new FileDescription(audioFile.FileName, audioFile.OpenReadStream()),
    };

    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
    Console.WriteLine(uploadResult); 
    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
    {
        return uploadResult.SecureUrl.AbsoluteUri;
    }

    throw new Exception("Failed to upload audio file to Cloudinary");
}

    // HandleSeenNotification method to process seen notifications
private async Task HandleSeenNotification(SeenNotification notification)
{

    var currentMessage = await _messageService.GetMessageById(notification.MessageId); 

        if (currentMessage.Read)
    {
        // The message has already been read, no further action needed
        Console.WriteLine($"Message {notification.MessageId} has already been read at {currentMessage.ReadTime}");
        return;
    }

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


    private async Task HandleRecordingNotification(RecordingNotification notification)
    {
        if (_userConnections.TryGetValue(notification.ReceiverId, out var receiverSocket))
        {
            var notificationJson = JsonSerializer.Serialize(notification);
            var responseMessage = Encoding.UTF8.GetBytes(notificationJson);
            await receiverSocket.SendAsync(new ArraySegment<byte>(responseMessage), WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine($"Recording notification sent to User {notification.ReceiverId}");
        }
        else
        {
            Console.WriteLine($"User {notification.ReceiverId} is not connected.");
        }
    }




}