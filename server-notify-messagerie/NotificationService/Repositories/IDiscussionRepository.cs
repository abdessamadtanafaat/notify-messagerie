public interface IDiscussionRepository {

  Task<IEnumerable<Discussion>> GetDiscussionsForUser(string userId); 

}