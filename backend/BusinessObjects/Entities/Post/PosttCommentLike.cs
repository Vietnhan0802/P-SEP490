using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Post
{
    public class PosttCommentLike
    {
        [Key]
        public Guid idPostCommentLike { get; set; }
        public string? idAccount { get; set; }
        public Guid idPostComment { get; set; }
        public DateTime createdDate { get; set; }
        public PosttComment? PosttComment { get; set; }
    }
}
