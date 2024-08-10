namespace NotificationService.Security.Models;

public class UpdateProfileReq
{
    public String? avatarUrl {get; set;}
    public String? username {get; set; }
    public String? about {get; set; }
}