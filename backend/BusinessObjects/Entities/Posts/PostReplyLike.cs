using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class PostReplyLike
    {
        [Key]
        public Guid idPostReplyLike { get; set; }
        public string idAccount { get; set; }
        public Guid idPostReply { get; set; }
        public DateTime createdDate { get; set; }
        public PostReply? PostReply { get; set; }
    }
}
