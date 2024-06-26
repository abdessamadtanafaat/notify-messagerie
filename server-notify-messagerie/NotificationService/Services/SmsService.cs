using Microsoft.Extensions.Options;
using NotificationService.Models;
using Twilio;
using Twilio.Rest.IpMessaging.V1.Service.Channel;
using Twilio.TwiML.Messaging;
using Twilio.Types;
using MessageResource = Twilio.Rest.Api.V2010.Account.MessageResource;

namespace NotificationService.Services;

public class SmsService : ISmsService
{
    private readonly SmsSettings _smsSettings;
    
    public SmsService(IOptions<SmsSettings> smsSettings)
    {
        _smsSettings = smsSettings.Value;
        
        // Initialize Twilio client with account identification and password
        TwilioClient.Init(_smsSettings.SmsAccountIdentification, _smsSettings.SmsAccountPassword);
    }
    
    public async Task sendSmsAsync(string toPhoneNumber, string message)
    {
        if (string.IsNullOrEmpty(toPhoneNumber))
        {
            throw new ArgumentNullException(nameof(toPhoneNumber), "Phone number cannot be null or empty."); 
        }
        
        var to = new PhoneNumber(toPhoneNumber); 
        var from = new PhoneNumber(_smsSettings.SmsAccountFrom);

        var messageResource = await MessageResource.CreateAsync(
            to: to,
            from: from,
            body: message
        ); 
        
        // Optional: Log the message SID or other info if needed
        Console.WriteLine($"Message sent: {messageResource.Sid}");
    
}
    
}
