using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Post
{
    public class PosttComment
    {
        [Key]
        public Guid idPostComment { get; set; }
        public string idAccount { get; set; }
        public Guid idPost { get; set; }
        public string content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public Postt Postt { get; set; }
        public ICollection<PosttCommentLike> PosttCommentLikes { get; set; }
        public ICollection<PosttReply> PosttReplies { get; set; }
    }
}
