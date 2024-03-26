namespace BusinessObjects.ViewModels.Follow
{
    public class FollowingView
    {
        public Guid idFollowList { get; set; }
        public string idOwner { get; set; }
        public string? emailOwner { get; set; }
        public string? fullNameOwner { get; set; }
        public string? avatarOwner { get; set; }
        public string idAccount { get; set; }
        public string? emailAccount { get; set; }
        public string? fullNameAccount { get; set; }
        public string? avatarAccount { get; set; }
        public DateTime createdDate { get; set; }
    }
}
