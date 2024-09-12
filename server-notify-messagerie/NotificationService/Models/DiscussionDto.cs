using NotificationService.Models;

public class DiscussionDto
{
    public string? Id { get; set; }
    public User? Receiver { get; set; }
    public Message? LastMessage { get; set; }

    public Boolean IsBlocked { get; set;} = false; 
    public Boolean IsArchived { get; set;} = false; 
    public Boolean IsPinned { get; set;} = false; 


    
}

public class SingleDiscussion  
{
    public string? Id { get; set; }
    public User? Users { get; set; }
    public List<Message>? Messages { get; set; }
}