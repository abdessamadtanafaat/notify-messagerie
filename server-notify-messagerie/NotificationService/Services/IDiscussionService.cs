public interface IDiscussionService {
Task<IEnumerable<DiscussionDto>> GetDiscussionsWithMessages(string userId); 

}