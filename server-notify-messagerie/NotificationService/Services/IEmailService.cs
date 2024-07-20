namespace NotificationService.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string message);
    string GenerateEmailMessage(string firstName, string lastName, string token);
    public string GenerateTokenEmail();
    string ResetPasswordByEmail(string firstName, string lastName, string tokenEmail);
}