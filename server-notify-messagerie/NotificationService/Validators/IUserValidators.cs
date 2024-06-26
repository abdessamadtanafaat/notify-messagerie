using NotificationService.Models;

namespace NotificationService.Validators
{
    public interface IUserValidators
    {
        void Validate(User user);
        bool IsValidPassword(string password);
        bool IsValidEmail(string email);
        bool IsValidPhone(string phone);
    }
}