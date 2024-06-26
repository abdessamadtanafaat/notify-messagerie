using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NotificationService.Models;

public class User
{
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? FullName { get; set; }
         public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? TokenEmail { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool IsEmailTokenUsed { get; set; }
        public DateTime LastLogin { get; set; }
        public DateTime LastLogout { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool Active { get; set; }
        public string?  RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }


}