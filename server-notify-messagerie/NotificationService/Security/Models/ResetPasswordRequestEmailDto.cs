namespace NotificationService.Security.Models;

public class ResetPasswordRequestEmailDto
{
    public string? TokenEmail { get; set; }
    public string? Password { get; set; }
}