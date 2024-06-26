namespace NotificationService.Security.Models;

public class AuthRequestDto
{
    public string EmailOrPhoneNumber { get; set; }
    public string Password { get; set; }
}