using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class BlogImage
    {
        [Key]
        public Guid idBlogImage { get; set; }
        public Guid idBlog { get; set; }
        public string? image { get; set; }
        public DateTime createdDate { get; set; }
        public Blog? Blog { get; set; }
    }
}
