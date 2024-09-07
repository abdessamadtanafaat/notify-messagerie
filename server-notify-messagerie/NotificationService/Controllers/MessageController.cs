
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;



namespace NotificationService.Controllers
{
    [Route("Discussions")]
    [ApiController]

    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IDiscussionService _discussionService;
        private readonly IWebSocketService _webSocketService;





        public MessageController(IMessageService messageService,
                                 IDiscussionService discussionService,
                                 IWebSocketService webSocketService
                                )
        {
            _messageService = messageService;
            _discussionService = discussionService;
            _webSocketService = webSocketService;
        }

        [HttpPost]
        [Route("send")]
        public async Task<ActionResult> SendMessage([FromBody] Message message)
        {
            await _messageService.SendMessage(message);
            return Ok("successfully sent");
        }

        [HttpGet("messages/{userId}")]
        public async Task<IActionResult> GetDiscussions(string userId,[FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var discussions = await _discussionService.GetDiscussionsWithMessages(userId, pageNumber, pageSize);
            return Ok(discussions);
        }

        [HttpGet("Discussion/{userId}/{selectedUserId}")]
        public async Task<IActionResult> GetDiscussion(string userId, string selectedUserId, DateTime? cursor = null, int limit = 10)
        {
            var discussion = await _discussionService.GetDiscussionForTwoUsers(userId, selectedUserId, cursor, limit);
            return Ok(discussion);
        }

        [HttpPost]
        [Route("uploadAudio")]
        public async Task<ActionResult> UploadAudio(IFormFile file)
        {
            string audioFilePath = await _webSocketService.SaveAudioFile(file);
            return Ok(new { secure_url = audioFilePath });
        }

        //  send message type image .
        [HttpPost]
        [Route("uploadFile")]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
            string filePath = await _webSocketService.UploadFileAsync(file);
            return Ok(new { secure_url = filePath });
        }

        [HttpDelete("discussion/{discussionId}")]
        //[Authorize]
        public async Task<IActionResult> DeleteDiscussion(string discussionId)
        {
            await _discussionService.DeleteDiscussionAsync(discussionId);
            return NoContent();
        }

        [HttpPut("doingWithDiscussion")] 
        //[Authorize]
        public async Task<IActionResult> DoWithDiscussion([FromBody]DoingWithDiscussion doingWithDiscussion) {
            await _discussionService.DoWithDiscussion(doingWithDiscussion.DiscussionId, doingWithDiscussion.DoingWithDiscussionChoice ); 
            return Ok(); 
        }


    }


}