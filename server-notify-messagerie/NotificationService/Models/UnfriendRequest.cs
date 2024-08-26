public class UnfriendRequest {
    public string UserId {get; set;}
    public string FriendId {get; set;}

        // Constructor with validation
    public UnfriendRequest(string userId, string friendId)
    {
        UserId = userId ?? throw new ArgumentNullException(nameof(userId));
        FriendId = friendId ?? throw new ArgumentNullException(nameof(friendId));
    }
    
}