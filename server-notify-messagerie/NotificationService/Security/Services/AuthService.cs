using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using NotificationService.Exceptions;
using NotificationService.Models;
using NotificationService.Repositories;
using NotificationService.Security.Models;
using NotificationService.Services;
using NotificationService.Validators;

namespace NotificationService.Security.Service;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtHandler _jwtHandler;
    private readonly IUserValidators _userValidators;
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;
    private readonly IMapper _mapper;

    public AuthService(IUserRepository userRepository, IJwtHandler jwtHandler, IUserValidators userValidators, IEmailService emailService, ISmsService smsService, IMapper mapper)
    {
        _userRepository = userRepository;
        _jwtHandler = jwtHandler;
        _userValidators = userValidators;
        _emailService = emailService;
        _smsService = smsService;
        _mapper = mapper;
    }
    public async Task<AuthResponseDto> Login(AuthRequestDto authRequest)
    {
        var user = await _userRepository.GetUserByEmailOrPhoneAsync(authRequest.EmailOrPhoneNumber);
        
        if (user == null)
        {
            throw new ValidationException("Invalid Email or phone number."); 
        }

        if (!user.IsEmailVerified)
        {
            throw new NotFoundException("Invalid Email Or phone number.");
        }

        if (!VerifyPassword(authRequest.Password, user.Password))
        {
            throw new ValidationException("Invalid Password."); 
        }

        var token = _jwtHandler.GenerateToken(user);
        var refreshToken = _jwtHandler.GenerateRefreshToken();
        var refreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = refreshTokenExpiryTime; 
        user.LastLogin = DateTime.UtcNow;
        user.Active = true;
        
        await _userRepository.UpdateUserAsync(user.Id, user);
        
        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            Username = user.Username
        }; 
    }
    
    public async Task Register(RegisterRequestDto registerDto)
    {
        
        var user = _mapper.Map<User>(registerDto); 

        _userValidators.Validate(user); 
        var existingUserEmail = await _userRepository.GetUserByEmailAsync(user.Email);
        if (existingUserEmail != null)
        {
            throw new ValidationException("Email already exist."); 
        }
        var existingUserUsername = await _userRepository.GetUserByUsernameAsync(user.Username);
        if (existingUserUsername != null)
        {
            throw new ValidationException("Username already exist."); 
        }
        user.Password = HashPassword(user.Password);
        user.CreatedAt = DateTime.Now;
        
        var tokenEmail = _emailService.GenerateTokenEmail();
        var message = _emailService.GenerateEmailMessage(user.Username, tokenEmail);

        user.TokenEmail = tokenEmail;
        user.CreatedAt = DateTime.UtcNow;
        
        await _emailService.SendEmailAsync(user.Email, "Account Verification", message); 
        await _userRepository.CreateUserAsync(user);
        Console.WriteLine($"{user.TokenEmail}");
        
    }

    public async Task VerifyEmail(string tokenEmail)
    {
        var user = await _userRepository.GetuserByTokenEmail(tokenEmail);
        if (user == null)
        {
            throw new NotFoundException("Invalid token."); 
        }
        if (user.IsEmailTokenUsed)
        {
            throw new ValidationException("Token has already been used.");
        }
            
        TimeSpan tokenExpiryWindow = TimeSpan.FromDays(5);

        if (DateTime.UtcNow > user.CreatedAt + tokenExpiryWindow)
        {
            throw new ValidationException("token has expired.");
        }

        user.IsEmailVerified = true;
        user.IsEmailTokenUsed = true; 
        await _userRepository.UpdateUserAsync(user.Id, user);
    }

    public async Task ForgetPasswordByEmail(string email)
    {
        var user = await _userRepository.GetUserByEmailAsync(email);
        if (user == null)
        {
            throw new NotFoundException("Email Not exist.");
        }
        var tokenEmail = _emailService.GenerateTokenEmail();
        var message = _emailService.ResetPasswordByEmail(user.Username, tokenEmail);

        user.TokenEmail = tokenEmail;
        
        await _emailService.SendEmailAsync(user.Email, "Password Reset", message); 
        await _userRepository.CreateUserAsync(user);
    }

    public async Task ForgetPasswordByPhone(string phoneNumber)
    {
        var user = await _userRepository.GetUserByPhoneAsync(phoneNumber);
        if (user == null)
        {
            throw new NotFoundException("Phone Number Not exist.");
        }

        // Generate random 4-digit token
        Random random = new Random();
        int token = random.Next(1000, 10000);

        // Construct SMS message
        var smsMessage = $"Hi {user.Username}, your Notify As Service App verification code: {token}";
        
        await _smsService.sendSmsAsync(phoneNumber,smsMessage );
    }

    public async Task ChangePassword(string  userId , string oldPassword,  string newPassword)
    {
        var user = await _userRepository.GetUserByEmailAsync(userId);
        if (user == null)
        {
            throw new NotFoundException("Email Not found");
        }

        if (!VerifyPassword(oldPassword, user.Password))
        {
            throw new ValidationException("Invalid Password."); 
        }
        if (user.Password == HashPassword(newPassword))
        {
            throw new ValidationException("Use a different Password."); 
        }
        _userValidators.IsValidPassword(newPassword);
            
        user.Password = HashPassword(newPassword);
            
        await _userRepository.UpdateUserAsync(user.Id, user);
    }
    public async Task<bool> LogOut(string? userEmail)
    {
        var user = await _userRepository.GetUserByEmailAsync(userEmail);
        if (user == null)
        {
            throw new NotFoundException("User Not found");
        }

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = DateTime.MinValue;
        user.LastLogout = DateTime.UtcNow;
        user.Active = false;
        
        await _userRepository.UpdateUserAsync(user.Id, user);
            
        return true;
    }
    
    public string HashPassword(String password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash); 
    }

    public  bool VerifyPassword(string enteredPassword, string storedHashedPassword)
    {
        var hashedPassword = HashPassword(enteredPassword);
        return hashedPassword == storedHashedPassword; 
    }
    
}
