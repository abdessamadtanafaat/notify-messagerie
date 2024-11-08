﻿using NotificationService.Models;
using NotificationService.Security.Models;

namespace NotificationService.Security.Service;

public interface IAuthService
{
    Task<AuthResponseDto> Login(AuthRequestDto authRequest);
    Task Register(RegisterRequestDto registerDto);
    Task VerifyEmail(string tokenEmail);
    Task ForgetPasswordByEmail(string email);
    Task SendSms(string phoneNumber, string email);
    public Task resetPasswordBySms(string phoneNumber);
    string HashPassword(String password);
    bool VerifyPassword(string enteredPassword, string storedHashedPassword);
    Task ChangePassword(string userId, string oldPassword, string newPassword);
    Task<bool> LogOut(string? userId);


    Task VerifyPhoneNumber(int tokenPhoneNumber);
    Task ResetPassword(int tokenPhoneNumber, string password);
    Task ResetPasswordByEmail(string resetPasswordrequestTokenEmail, string resetPasswordrequestPassword);
}