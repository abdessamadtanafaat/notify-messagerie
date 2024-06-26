using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using NotificationService.Models;
using Twilio.Jwt.AccessToken;

namespace NotificationService.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }
    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
            Subject = subject,
            Body = message,
            IsBodyHtml = true,

        }; 
        mailMessage.To.Add(new MailAddress(toEmail));
        using (var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
        {
            smtpClient.Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password);
            smtpClient.EnableSsl = true;
            await smtpClient.SendMailAsync(mailMessage); 
        }
    }

    public string GenerateTokenEmail()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        Random random = new Random(); 
        return new string (Enumerable.Repeat(chars, 20)
            .Select(s=> s[random.Next(s.Length)]).ToArray()); 
    }

    public string ResetPasswordByEmail(string userUsername, string tokenEmail)
    {
        // Assuming you have a placeholder for your application logo image
        string logoUrl = "https://i.ibb.co/8P73jGr/pngegg.png"; 
        string resetLink = $"https://localhost:3000/reset-password/{tokenEmail}";
        
        // Generate the expiry date for the verification link (5 days from now)
        DateTime expiryDate = DateTime.Now.AddDays(5); 
    return $@"
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    padding-bottom: 20px;
                }}
                .content {{
                    line-height: 1.6;
                }}
                .button-container {{
                    text-align: center;
                    margin-top: 20px;
                }}
                .button {{
                    display: inline-block;
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 0.8em;
                    color: #777;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Password Reset Request</h1>
                </div>
                <div class='content'>
                    <p>Hi {userUsername},</p>
                    <p>You recently requested to reset your password. Please click the button below to reset it.</p>
                </div>
                <div class='button-container'>
                    <a href='{resetLink}' class='button'>Reset Your Password</a>
                </div>
                <div class='footer'>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                    <p>&copy; {DateTime.Now.Year} Notify As Service. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";    }

    public string GenerateEmailMessage(string username, string tokenEmail)
{
    // Assuming you have a placeholder for your application logo image
    string logoUrl = "https://i.ibb.co/8P73jGr/pngegg.png"; 
    string verifyEmailUrl = $"https://localhost:3000/verify-email/{tokenEmail}";

    // Generate the expiry date for the verification link (5 days from now)
    DateTime expiryDate = DateTime.Now.AddDays(5);

    return $@"
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #a6a4a4;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    padding-bottom: 20px;
                }}
                .content {{
                    line-height: 1.6;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 0.8em;
                    color: #777;
                }}
                .logo {{
                    text-align: center;
                    margin-bottom: 20px;
                }}
                .verify-button {{
                    background-color: #4CAF50;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: block;
                    width: 50%;
                    margin: 20px auto; /* Center the button horizontally */
                    font-size: 16px;
                    cursor: pointer;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='logo'>
                    <img src='{logoUrl}' alt='App Logo' style='max-width: 100px; height: auto;' />
                </div>
                <div class='header'>
                    <h1>Verify Your Email Address</h1>
                </div>
                <div class='content'>
                    <p><strong>Hello {username}</strong></p>
                    <p>To continue setting up your NotifyAsService account, please verify that this is your email address.</p>
                    <p>Click the button below to verify:</p>
                    <a href='{verifyEmailUrl}' class='verify-button'>Verify Email Address</a>
                    <p><em>This link will expire on {expiryDate.ToString("yyyy-MM-dd HH:mm:ss")} UTC.</em></p>
                    <p>If you did not request this email, please disregard it.</p>
                </div>
                <div class='footer'>
                    <p>&copy; {DateTime.Now.Year} Notify As Service. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";
}

}