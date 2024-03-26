using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class BlogCommentLike
    {
        [Key]
        public Guid idBlogCommentLike { get; set; }
        public string idAccount { get; set; }
        public Guid idBlogComment { get; set; }
        public DateTime createdDate { get; set; }
        public BlogComment? BlogComment { get; set; }
    }
}
