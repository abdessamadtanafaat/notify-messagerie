using MediatR;
using NotificationService.Models;
using NotificationService.Services;
using Twilio.Http;

namespace NotificationService.Handlers;

public class NotificationHandler : IRequestHandler<NotificationCommand>
{
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public NotificationHandler(IEmailService emailService, ISmsService smsService)
    {
        _emailService = emailService;
        _smsService = smsService;
    }

    public async Task Handle(NotificationCommand notificationCommand,
        CancellationToken cancellationToken)
    {
        if (notificationCommand.Type == "email")
        {
            await _emailService.SendEmailAsync(notificationCommand.Destination, "Notification",
                notificationCommand.Message); 
        }

        else if (notificationCommand.Type =="sms")
        {
            await _smsService.sendSmsAsync(notificationCommand.Destination,
                                            notificationCommand.Message); 
        }
    }

}