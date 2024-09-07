public class DoingWithDiscussion {
    public string DiscussionId {get; set;}
    public DoingWithDiscussionOperation DoingWithDiscussionChoice {get; set;}
    public enum DoingWithDiscussionOperation {
        Blocked, 
        Archived,
        Pinned,
    }

    public DoingWithDiscussion(string discussionId )
    {
        DiscussionId = discussionId ?? throw new ArgumentNullException(nameof(discussionId));

    }
}