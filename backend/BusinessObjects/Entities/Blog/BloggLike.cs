using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blog
{
    public class BloggLike
    {
        [Key]
        public Guid idBlogLike { get; set; }
        public string? idAccount { get; set; }
        public Guid idBlog { get; set; }
        public DateTime createdDate { get; set; }
        public Blogg? Blogg { get; set; }
    }
}
