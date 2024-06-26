using MediatR;

namespace NotificationService.Models;

public class NotificationCommand : IRequest
{
    public string Destination { get; set; } // email or sms 
    public string Message { get; set; }
    public string Type { get; set; } //email or sms
    
}