using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NotificationService.Models;
using NotificationService.Security.Models;
using NotificationService.Security.Service;
using NotificationService.Services;

namespace NotificationService.Security.Controllers;

[Route("[Controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IJwtHandler _jwtHandler;

    public AuthController(IAuthService authService, IJwtHandler jwtHandler)
    {
        _authService = authService;
        _jwtHandler = jwtHandler;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
    {
        
        await _authService.Register(registerDto);
        return Ok($"Registration successful. Please check your email for login token.");
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequestDto authRequest)
    {
        var authResponse = await _authService.Login(authRequest);

            Response.Cookies.Append("token", authResponse.Token, new CookieOptions
    {
        HttpOnly = false, //si true the front end cannot be accessid via javascript !! 
        Secure = false, // Set to true if using HTTPS
        SameSite = SameSiteMode.Strict
    });

    Response.Cookies.Append("refreshToken", authResponse.RefreshToken, new CookieOptions
    {
        HttpOnly = false,
        Secure = false, // Set to true if using HTTPS
        SameSite = SameSiteMode.Strict
    });
    
        return Ok(authResponse); 
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(string oldPassword, string newPassword)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        await _authService.ChangePassword(userId,oldPassword, newPassword);
        return Ok("Password Successfully changed"); 
    }
    
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery]string tokenEmail)
    {
        await _authService.VerifyEmail(tokenEmail);
        return Ok("Verification successful. You can now log in to your account."); 
    }
    
    [HttpPost("verify-phone")]
    public async Task<IActionResult> verifyPhoneNumber([FromQuery]int tokenPhoneNumber)
    {
        await _authService.VerifyPhoneNumber(tokenPhoneNumber);
        return Ok("Verification successful. You can now continue using your account."); 
    }    
    
    [HttpPost("reset-password-by-email")]
    public async Task<IActionResult> ResetPasswordByEmail([FromBody] ResetPasswordRequestEmailDto ResetPasswordrequest)
    {
        await _authService.ResetPasswordByEmail(ResetPasswordrequest.TokenEmail,ResetPasswordrequest.Password);
        return Ok("You now log In to your account."); 
    }
    
    [HttpPost("reset-password-by-phone")]
    public async Task<IActionResult> ResetPasswordByPhone([FromBody] ResetPasswordRequestPhoneDto ResetPasswordrequest)
    {
        await _authService.ResetPassword(ResetPasswordrequest.TokenPhoneNumber,ResetPasswordrequest.Password);
        return Ok("You now log In to your account."); 
    }
    
    [HttpPost("reset-password-by-email-request")]
    public async Task<IActionResult> ResetPasswordByEmail([FromQuery]string email)
    {
        await _authService.ForgetPasswordByEmail(email);
        return Ok("Check Your email to get the new password."); 
    }
    
    [HttpPost("send-sms")]
    public async Task<IActionResult> SendSms([FromQuery]string phoneNumber, string email)
    {
        await _authService.SendSms(phoneNumber, email);
        return Ok("Check Your phone Number to get the code verification."); 
    }

    [HttpPost("send-sms-from-reset-password")]
    public async Task<IActionResult> resetPasswordBySms([FromQuery]string phoneNumber)
    {
        await _authService.resetPasswordBySms(phoneNumber);
        return Ok("Check Your phone Number to get the code verification."); 
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string userId)
    {
        //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _authService.LogOut(userId);
        return Ok("Logout Successfully."); 
    }
    
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
    {
        try
        {
            var newJwtToken = await _jwtHandler.RefreshTokenAsync(refreshToken);
            return Ok(new { JwtToken = newJwtToken });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
    }
}