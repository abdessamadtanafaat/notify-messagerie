public class CancelledFriendRequest {
    public string UserId {get; set;}
    public string FriendId {get; set;}
    public CancelledFriendRequest(string userId, string friendId )
    {
        UserId = userId ?? throw new ArgumentNullException(nameof(userId));
        FriendId = friendId ?? throw new ArgumentNullException(nameof(FriendId));

    }
}