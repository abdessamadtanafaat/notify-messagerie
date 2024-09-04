public class AnswerInvitationRequest {
    public string UserId {get; set;}
    public string FriendId {get; set;}
    public InvitationResponse AnswerInvitationChoice {get; set;}
    public enum InvitationResponse {
        Accepted, 
        rejected
    }

    public AnswerInvitationRequest(string userId, string friendId )
    {
        UserId = userId ?? throw new ArgumentNullException(nameof(userId));
        FriendId = friendId ?? throw new ArgumentNullException(nameof(FriendId));

    }
}