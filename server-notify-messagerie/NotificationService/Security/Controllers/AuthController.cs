using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    
    [HttpPost("reset-password-by-email")]
    public async Task<IActionResult> ResetPasswordByEmailorgetPassword([FromQuery]string email)
    {
        await _authService.ForgetPasswordByEmail(email);
        return Ok("Check Your email to get the new password."); 
    }
    
    [HttpPost("reset-password-by-sms")]
    public async Task<IActionResult> ResetPasswordBySms([FromQuery]string phoneNumber)
    {
        await _authService.ForgetPasswordByPhone(phoneNumber);
        return Ok("Check Your phone Number to get the new password."); 
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userEmail = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        await _authService.LogOut(userEmail);
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