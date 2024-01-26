using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Post
{
    public class PosttReply
    {
        [Key]
        public Guid idPostReply { get; set; }
        public string? idAccount { get; set; }
        public Guid idPostComment { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public PosttComment? PosttComment { get; set; }
        public ICollection<PosttReplyLike>? PosttReplyLikes { get; set; }
    }
}
