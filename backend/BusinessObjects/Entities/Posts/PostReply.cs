using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class PostReply
    {
        [Key]
        public Guid idPostReply { get; set; }
        public string idAccount { get; set; }
        public Guid idPostComment { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public PostComment? PostComment { get; set; }
        public ICollection<PostReplyLike>? PostReplyLikes { get; set; }
    }
}
