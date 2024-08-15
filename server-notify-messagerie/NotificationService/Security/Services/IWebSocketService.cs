
namespace NotificationService.Security;
using System.Net.WebSockets;


public interface IWebSocketService
{
Task HandleWebSocketAsync(WebSocket webSocket, string userId);
}