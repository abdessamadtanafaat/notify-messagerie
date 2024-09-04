public interface IInvitationsRepository {

    Task<List<Invitations>> GetInvitationsAsync(string userId, int pageNumber = 1, int pageSize = 6); 

}