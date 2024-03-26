using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class PostComment
    {
        [Key]
        public Guid idPostComment { get; set; }
        public string idAccount { get; set; }
        public Guid idPost { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public Post? Post { get; set; }
        public ICollection<PostCommentLike>? PostCommentLikes { get; set; }
        public ICollection<PostReply>? PostReplies { get; set; }
    }
}
