using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using NotificationService.Exceptions;
using NotificationService.Models;

namespace NotificationService.Validators;

public class UserValidators : IUserValidators
{
    public void Validate(User user)
    {
        // if (string.IsNullOrEmpty(user.Username))
        // {
        //     throw new ValidationException("Username cannot be empty");
        // }

        if (string.IsNullOrEmpty(user.Email))
        {
            throw new ValidationException("Email cannot be empty");
        }

        // Example validation for createdAt (just to illustrate, adjust as needed)
        if (user.CreatedAt == default(DateTime))
        {
            throw new ValidationException("CreatedAt must be specified");
        }
        if (!IsValidEmail(user.Email))
        {
            throw new ValidationException("Invalid email format");
        }
        if (!IsValidPassword(user.Password))
        {
            throw new ValidationException("Password must be stronger.");
        }
        
        if (!IsValidPhone(user.PhoneNumber))
        {
            throw new ValidationException("Invalid Phone.");
        }
        
        // Example validation for active
        // (assuming you have specific business rules for active)
        if (user.Active != true && user.Active != false)
        {
            throw new ValidationException("Active must be either true or false");
        }
    }
    public bool IsValidPassword(string password)
    {
        // Example criteria for a strong password:
        // - Minimum length of 8 characters
        // - Contains at least one uppercase letter
        // - Contains at least one lowercase letter
        // - Contains at least one digit
        // - Contains at least one special character (e.g., !@#$%^&*)

        const int RequiredLength = 8;

        if (string.IsNullOrEmpty(password) || password.Length < RequiredLength)
        {
            return false;
        }

        bool hasUpperCase = false;
        bool hasLowerCase = false;
        bool hasDigit = false;
        bool hasSpecialChar = false;

        foreach (char c in password)
        {
            if (char.IsUpper(c))
            {
                hasUpperCase = true;
            }
            else if (char.IsLower(c))
            {
                hasLowerCase = true;
            }
            else if (char.IsDigit(c))
            {
                hasDigit = true;
            }
            else if (!char.IsLetterOrDigit(c))
            {
                hasSpecialChar = true;
            }
        }

        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    }
    // Helper method to validate email format using regular expression
    public bool IsValidEmail(string email)
    {
        // This regular expression is a basic example, adjust as per your requirements
        string emailPattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
        return Regex.IsMatch(email, emailPattern);
    }
    public bool IsValidPhone(string phone)
    {
        // Regular expression pattern for validating phone number
        string pattern = @"^\+\d{12}$";

        // Check if the phone number matches the pattern
        return Regex.IsMatch(phone, pattern);
    }
}