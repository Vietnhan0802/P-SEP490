using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class BlogReply
    {
        [Key]
        public Guid idBlogReply { get; set; }
        public string idAccount { get; set; }
        public Guid idBlogComment { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public BlogComment? BlogComment { get; set; }
        public ICollection<BlogReplyLike>? BlogReplyLikes { get; set; }
    }
}
