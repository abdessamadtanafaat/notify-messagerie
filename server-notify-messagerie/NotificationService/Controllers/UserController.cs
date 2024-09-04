using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotificationService.Models;
using NotificationService.Security.Models;
using NotificationService.Services;

namespace NotificationService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(user);
        }

        [HttpPost("byIds")]
        public async Task<IActionResult> GetUsersByIds([FromBody] List<string> ids)
        {
            if (ids == null || ids.Count == 0)
            {
                return BadRequest("No IDs provided.");
            }

            var users = await _userService.GetUsersByIdsAsync(ids);
            
            if (users == null)
            {
                return NotFound("No users found for the provided IDs.");
            }

            return Ok(users);
        }
    
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            var createdUser = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string id, User user)
        {
            await _userService.UpdateUserAsync(id, user);
            return NoContent();
        }

        [HttpPut("/update-profile/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdateProfileReq profileUpdateReq)
        {
            await _userService.UpdateProfileAsync(id, profileUpdateReq);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
        
        [HttpPost("unfriend")]
        //[Authorize]
        public async Task<IActionResult> Unfriend([FromBody] UnfriendRequest unfriendRequest) {
            await _userService.UnfriendAsync(unfriendRequest.UserId, unfriendRequest.FriendId);
            return Ok (new {Message = "Successfully unfrieded"}); 
        }

        [HttpPost("search")]
        //[Authorize]
        public async Task<IEnumerable<MyFriends>> Search([FromBody] SearchRequest searchRequest, [FromQuery] int pageNumber, [FromQuery] int pageSize) {
            var users = await _userService.SearchUsersByFirstNameOrLastNameAsync(searchRequest,pageNumber,pageSize);
            return users;
        }

        [HttpPost("addFriend")]
        //[Authorize]
        public async Task<IActionResult> AddFriendAsync(FriendRequest friendRequest) {
            await _userService.AddFriendAsync(friendRequest.UserId, friendRequest.FriendId); 
            return Ok(new {Message = "Invitation sent successfully."}); 
        }

        // Accepte or refuse the invitation received . 
        [HttpPost("answerInvitation")] 
        //[Authorize]
        public async Task<MyFriends> AnswerInvitation([FromBody]AnswerInvitationRequest answerInvitationRequest) {

            var MyInvitation = await _userService.AnswerInvitationAsync(answerInvitationRequest.UserId,
             answerInvitationRequest.FriendId,
             answerInvitationRequest.AnswerInvitationChoice ); 
            return MyInvitation; 
        }

        // Accepte or refuse the invitation received . 
        [HttpGet("friends/{userId}")] 
        //[Authorize]
        public async Task<IEnumerable<MyFriends>> GetFriends(string userId, [FromQuery] int pageNumber, [FromQuery] int pageSize) {
            var friends = await _userService.GetFriendsAsync(userId,pageNumber,pageSize); 
            return  friends ; 
        }

        [HttpGet("commonFriends")] 
        //[Authorize]
        public async Task<IEnumerable<User>> GetCommonFriends([FromQuery] string userId, [FromQuery]string friendId) {
            var Commonfriends = await _userService.GetMutualFriendsAsync(userId,friendId); 
            return  Commonfriends ; 
        }


        [HttpGet("invitationsFriends/{userId}")] 
        //[Authorize]
        public async Task<IEnumerable<MyInvitations>> GetInvitationsFriends(string userId, [FromQuery] int pageNumber, [FromQuery] int pageSize) {
            var invitationsFriends = await _userService.GetInvitationsFriends(userId,pageNumber,pageSize); 
            return  invitationsFriends ; 
        }
    }
} 