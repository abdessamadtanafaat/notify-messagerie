using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NotificationService.Models;
using NotificationService.Repositories;
using NotificationService.Security.Repositories;

namespace NotificationService.Security;

public class JwtHandler : IJwtHandler
{
    private readonly JwtSettings _jwtSettings;
    private readonly ITokenRepository _tokenRepository; 

    public JwtHandler(IOptions<JwtSettings> jwtSettings, ITokenRepository tokenRepository)
    {
        _jwtSettings = jwtSettings.Value;
        _tokenRepository = tokenRepository;
    }

    public string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer, 
            audience:_jwtSettings.Audience, 
            claims: claims, 
            expires: DateTime.Now.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token); 

    }

    public string GenerateRefreshToken()
    {
        var randomNumaber = new byte[32];
        using (var rang = RandomNumberGenerator.Create())
        {
            rang.GetBytes(randomNumaber);
            return Convert.ToBase64String(randomNumaber);
        }
    }

    public async Task<string> RefreshTokenAsync(string refreshToken)
    {
        var user = await _tokenRepository.GetUserByRefreshTokenAsync(refreshToken);

        if (user!= null &&  user.RefreshToken == refreshToken && user.RefreshTokenExpiryTime > DateTime.UtcNow)
        {
            var jwtToken = GenerateToken(user);
            return jwtToken;
        }

        throw new UnauthorizedAccessException("Invalid refresh token or expired.");
    }
}