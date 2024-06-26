namespace NotificationService.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string message);
    string GenerateEmailMessage(string username, string token);
    public string GenerateTokenEmail();
    string ResetPasswordByEmail(string userUsername, string tokenEmail);
}