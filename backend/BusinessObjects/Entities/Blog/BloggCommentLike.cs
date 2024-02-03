using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blog
{
    public class BloggCommentLike
    {
        [Key]
        public Guid idBlogCommentLike { get; set; }
        public string? idAccount { get; set; }
        public Guid idBlogComment { get; set; }
        public DateTime createdDate { get; set; }
        public BloggComment? BloggComment { get; set; }
    }
}
