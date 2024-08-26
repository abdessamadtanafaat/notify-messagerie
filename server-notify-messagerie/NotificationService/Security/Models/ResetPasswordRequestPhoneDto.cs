namespace NotificationService.Security.Models;

public class ResetPasswordRequestPhoneDto
{
    public int TokenPhoneNumber { get; set; }
    public string? Password { get; set; }
}
