using NotificationService.Models;

public class DiscussionDto
{
    public string Id { get; set; }
    public UserDto Receiver { get; set; }
    public Message LastMessage { get; set; }
}

public class SingleDiscussion  
{
    public string Id { get; set; }
    public UserDto Users { get; set; }
    public List<Message> Messages { get; set; }
}