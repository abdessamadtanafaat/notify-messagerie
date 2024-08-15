public interface IDiscussionRepository {

  Task<IEnumerable<Discussion>> GetDiscussionsForUser(string userId); 
  Task<Discussion> GetDiscussionForTwoUsers(string userId, string selectedUserId); 
  Task UpdateDiscussionAsync(string IdDiscussion, Discussion discussion); 
  Task<Discussion> GetDiscussionByIdAsync(string id);


}