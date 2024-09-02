using NotificationService.Models;

public class MyFriends
{
    public User User { get; set; }  // User details
    public DateTime CreatedAt { get; set; }  // Date of the friendship
    public int NbMutualFriends{get; set;}
    public List<String>? MutualFriends{get; set;}


    public MyFriends() {}
    public MyFriends(User user, DateTime createdAt, int nbMutualFriends, List<String>? mutualFriends )
    {
        User = user;
        CreatedAt = createdAt;
        MutualFriends = mutualFriends;
        NbMutualFriends = nbMutualFriends;
    }

}
