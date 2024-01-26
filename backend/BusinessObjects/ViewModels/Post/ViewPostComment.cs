using BusinessObjects.Entities.Post;

namespace BusinessObjects.ViewModels.Post
{
    public class ViewPostComment
    {
        public Guid idPostComment { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public Guid idPost { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<PosttCommentLike>? PosttCommentLikes { get; set; }
        public ICollection<PosttReply>? PosttReplies { get; set; }
    }
}
