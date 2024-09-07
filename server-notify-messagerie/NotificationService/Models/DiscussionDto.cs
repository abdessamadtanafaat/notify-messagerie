using NotificationService.Models;

public class DiscussionDto
{
    public string? Id { get; set; }
    public User? Receiver { get; set; }
    public Message? LastMessage { get; set; }

    
}

public class SingleDiscussion  
{
    public string? Id { get; set; }
    public User? Users { get; set; }
    public List<Message>? Messages { get; set; }
}