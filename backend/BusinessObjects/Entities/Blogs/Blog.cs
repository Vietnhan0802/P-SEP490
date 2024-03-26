using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class Blog
    {
        [Key]
        public Guid idBlog { get; set; }
        public string idAccount { get; set; }
        public string? title { get; set; }
        public string? content { get; set; }
        public int? view { get; set; }
        public int? viewInDate { get; set; }
        public bool isDeleted { get; set; }
        public bool isBlock { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<BlogImage>? BlogImages { get; set; }
        public ICollection<BlogLike>? BlogLikes { get; set; }
        public ICollection<BlogComment>? BlogComments { get; set; }
    }
}
