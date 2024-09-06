using NotificationService.Models;

public class MyFriendsRequests
{
    public User User { get; set; }  // User details
    public DateTime SentAt { get; set; }  // Date of the friendship
    public int NbMutualFriends{get; set;}
    public List<String>? MutualFriends{get; set;}
    public string Status{get; set;}

    public MyFriendsRequests() {}
    public MyFriendsRequests(User user,
     DateTime sentAt,
    int nbMutualFriends,
    List<String>? mutualFriends, 
    string status
    
    
     )
    {
        User = user;
        SentAt = sentAt;
        MutualFriends = mutualFriends;
        NbMutualFriends = nbMutualFriends;
        Status = status; 
    }

}
