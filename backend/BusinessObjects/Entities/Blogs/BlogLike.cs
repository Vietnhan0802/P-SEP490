using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class BlogLike
    {
        [Key]
        public Guid idBlogLike { get; set; }
        public string idAccount { get; set; }
        public Guid idBlog { get; set; }
        public DateTime createdDate { get; set; }
        public Blog? Blog { get; set; }
    }
}
