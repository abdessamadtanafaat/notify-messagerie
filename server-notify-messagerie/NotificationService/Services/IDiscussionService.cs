public interface IDiscussionService {
//Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId); 
Task <SingleDiscussion> GetDiscussionForTwoUsers(string userId, string selectedUserId, DateTime? cursor = null, int limit = 10); 
Task UpdateDiscussion(string idDiscussion, Message message); 
Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId, DateTime? cursor, int limit = 10); 

}