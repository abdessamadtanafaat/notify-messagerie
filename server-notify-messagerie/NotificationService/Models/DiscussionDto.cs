using NotificationService.Models;

public class DiscussionDto
{
    public string Id { get; set; }
    public UserDto Receiver { get; set; }
    public Message LastMessage { get; set; }
}
