namespace BusinessObjects.ViewModels.Follow
{
    public class FollowingView
    {
        public string? idOwner { get; set; }
        public string? idAccount { get; set; }
        public string? email { get; set; }
        public string? fullName { get; set; }
        public string? avatar { get; set; }
        public DateTime createdDate { get; set; }
    }
}
