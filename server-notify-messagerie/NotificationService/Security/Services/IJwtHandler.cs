using NotificationService.Models;

namespace NotificationService.Security;

public interface IJwtHandler
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
    Task<string> RefreshTokenAsync(string refreshToken);

}