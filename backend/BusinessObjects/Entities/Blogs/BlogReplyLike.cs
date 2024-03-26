using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class BlogReplyLike
    {

        [Key]
        public Guid idBlogReplyLike { get; set; }
        public string idAccount { get; set; }
        public Guid idBlogReply { get; set; }
        public DateTime createdDate { get; set; }
        public BlogReply? BlogReply { get; set; }
    }
}
