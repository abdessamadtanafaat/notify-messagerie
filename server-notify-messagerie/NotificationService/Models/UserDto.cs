public class UserDto {

    public string? Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? AvatarUrl { get; set; }
    public bool? Active { get; set; }
    public DateTime? LastLogout { get; set; }

    public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? Work { get; set; }
        public string? Education { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public String? About {get; set;}
        public List<String>? Friends {get; set;}
        public   List<String>? FriendRequestsReceived {get; set;}
        public  List<String>? FriendRequestsSent {get; set;}
                public int? NbFriends {get; set;}
        public int? NbInvitations {get; set;}
        public int? NbFriendRequests {get; set;}

}