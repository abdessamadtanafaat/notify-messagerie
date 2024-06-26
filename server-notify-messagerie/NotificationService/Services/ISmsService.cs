namespace NotificationService.Services;

public interface ISmsService
{
    Task sendSmsAsync(string toPhoneNumber, string message); 

}