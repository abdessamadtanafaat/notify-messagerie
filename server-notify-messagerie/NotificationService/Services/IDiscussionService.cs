public interface IDiscussionService {
//Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId); 
Task <SingleDiscussion> GetDiscussionForTwoUsers(string userId, string selectedUserId, DateTime? cursor = null, int limit = 10); 
Task UpdateDiscussion(string idDiscussion, Message message); 
Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId, int pageNumber, int pageSize); 
Task DeleteDiscussionAsync(string discussionId); 

Task DoWithDiscussion(string discussionId,  DoingWithDiscussion.DoingWithDiscussionOperation doingWithDiscussionChoice); 

Task<IEnumerable<DiscussionDto>> SearchUsersByFirstNameOrLastNameOrLastMessageAsync(SearchRequest searchRequest,int pageNumber,int pageSize); 

}