
using Microsoft.AspNetCore.Mvc;

namespace NotificationService.Controllers
{
    [Route("Discussions")]
    [ApiController]

public class MessageController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IDiscussionService _discussionService;



    public MessageController(IMessageService messageService, IDiscussionService discussionService) 
    {
        _messageService = messageService;
        _discussionService = discussionService;
    }

    [HttpPost]
    [Route("send")]
    public async Task<ActionResult> SendMessage ([FromBody] Message message) {
        await _messageService.SendMessage(message); 
        return Ok("successfully sent"); 
    }

    [HttpGet("messages/{userId}")]
    public async Task<IActionResult> GetDiscussions(string userId){
        var discussions = await _discussionService.GetDiscussionsWithMessages(userId);
        return Ok(discussions); 
    }

    [HttpGet("Discussion/{userId}/{selectedUserId}")]
    public async Task<IActionResult> GetDiscussion(string userId, string selectedUserId){
        var discussion = await _discussionService.GetDiscussionForTwoUsers(userId, selectedUserId);
        return Ok(discussion); 
    }
}
}