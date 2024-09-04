using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;


namespace NotificationService.Models;

public class User
{
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        [JsonIgnore] // ignore it when serializ the objec to JSON . 
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? Work { get; set; }
        public string? Education { get; set; }
        [JsonIgnore]
        public string? TokenEmail { get; set; }
        [JsonIgnore]
        public DateTime? TokenCreatedAt {get; set;}
                [JsonIgnore]
        public bool IsEmailVerified { get; set; }
                [JsonIgnore]
        public bool IsEmailTokenUsed { get; set; }
                [JsonIgnore]
        public DateTime? LastLogin { get; set; }
        public DateTime? LastLogout { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public bool Active { get; set; }
        
        public string?  RefreshToken { get; set; }
        
        public DateTime? RefreshTokenExpiryTime { get; set; }
                [JsonIgnore]
        public bool IsFirstTimeLogin { get; set; }
                [JsonIgnore]
        public bool IsPhoneNumberVerified { get; set; }
        public bool IsTokenPhoneNumberUsed { get; set; }
                [JsonIgnore]
        public int TokenPhone { get; set; }
                [JsonIgnore]
        public DateTime? PhoneNumberExpiredAt { get; set; }
        public String? AvatarUrl { get; set;}
        public String? About {get; set;}
        public List<String>? Friends {get; set;}
        public List<String>? CommonFriends{get; set;}
        public   List<String>? FriendRequestsReceived {get; set;}
        public  List<String>? FriendRequestsSent {get; set;}
        public int? NbFriends {get; set;}
        public int? NbInvitations {get; set;}
        public int? NbFriendRequests {get; set;}


    

}