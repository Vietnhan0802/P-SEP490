namespace BusinessObjects.ViewModels.Post
{
    public class ViewPostComment
    {
        public Guid idPostComment { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public string? avatar { get; set; }
        public Guid idPost { get; set; }
        public string? content { get; set; }
        public int like { get; set; }
        public bool isLike { get; set; } = false;
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<ViewPostReply>? ViewPostReplies { get; set; }
    }
}
