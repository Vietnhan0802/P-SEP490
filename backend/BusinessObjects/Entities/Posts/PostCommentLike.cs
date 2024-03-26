using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class PostCommentLike
    {
        [Key]
        public Guid idPostCommentLike { get; set; }
        public string idAccount { get; set; }
        public Guid idPostComment { get; set; }
        public DateTime createdDate { get; set; }
        public PostComment? PostComment { get; set; }
    }
}
