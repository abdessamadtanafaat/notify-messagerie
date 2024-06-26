namespace NotificationService.Security.Models;

public class AuthResponseDto
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public string Username { get; set; }
}