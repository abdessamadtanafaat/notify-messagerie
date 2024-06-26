using MongoDB.Driver;
using NotificationService.Models;

namespace NotificationService.Security.Repositories;

public class TokenRepository: ITokenRepository
{

    private readonly IMongoCollection<User> _users;

    public TokenRepository(IMongoCollection<User> users)
    {
        _users = users;
    }
    public async Task<User> GetUserByRefreshTokenAsync(string refreshToken)
    {
        return await _users.Find(u => u.RefreshToken == refreshToken).FirstOrDefaultAsync();
    }
}