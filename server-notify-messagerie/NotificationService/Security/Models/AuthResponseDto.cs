namespace NotificationService.Security.Models;

public class AuthResponseDto
{
    public string Id { get; set; }
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public string Email { get; set; }

    public string Username { get; set; }
    public bool IsFirstTimeLogin { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? TokenEmail { get; set; }
    public DateTime? TokenCreatedAt { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsEmailTokenUsed { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime? LastLogout { get; set; }

    public DateTime? CreatedAt { get; set; } = DateTime.Now;
    public bool Active { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public bool IsPhoneNumberVerified { get; set; }
    public bool IsTokenPhoneNumberUsed { get; set; }
    public int TokenPhone { get; set; }
    public DateTime? PhoneNumberExpiredAt { get; set; }
    public String? AvatarUrl { get; set; }
    public String? about {get; set;}

}