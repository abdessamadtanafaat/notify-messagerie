using NotificationService.Models;

namespace NotificationService.Security.Repositories;

public interface ITokenRepository
{
    Task<User> GetUserByRefreshTokenAsync(string refreshToken);
}