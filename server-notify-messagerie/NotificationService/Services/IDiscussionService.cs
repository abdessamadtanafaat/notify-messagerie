public interface IDiscussionService {
Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId); 
Task<SingleDiscussion> GetDiscussionForTwoUsers(string userId, string selectedUserId);
Task UpdateDiscussion(string idDiscussion, Message message); 


}