using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Post
{
    public class PosttReplyLike
    {
        [Key]
        public Guid idPostReplyLike { get; set; }
        public string? idAccount { get; set; }
        public Guid idPostReply { get; set; }
        public DateTime createdDate { get; set; }
        public PosttReply? PosttReply { get; set; }
    }
}
