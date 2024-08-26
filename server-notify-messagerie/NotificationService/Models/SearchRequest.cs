public class SearchRequest {
    public string UserId {get; set;}
    public string SearchReq {get; set;}

        // Constructor with validation
    public SearchRequest(
        string userId,
        string searchReq)
    {
        UserId = userId ?? throw new ArgumentNullException(nameof(userId));
        SearchReq = searchReq ?? throw new ArgumentNullException(nameof(searchReq));
    }
    
}