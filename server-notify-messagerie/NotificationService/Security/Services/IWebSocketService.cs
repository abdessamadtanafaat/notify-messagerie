
using System.Net.WebSockets;
using Microsoft.AspNetCore.Http;



public interface IWebSocketService
{
Task HandleWebSocketAsync(WebSocket webSocket, string userId);
Task<string> SaveAudioFile(IFormFile audioFile);
}