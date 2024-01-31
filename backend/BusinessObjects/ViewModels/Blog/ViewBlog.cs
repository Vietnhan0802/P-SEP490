using BusinessObjects.Entities.Blog;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.Blog
{
    public class ViewBlog
    {
        [Key]
        public Guid idBlog { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public string? title { get; set; }
        public string? content { get; set; }
        public int view { get; set; }
        public int like { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<ViewBlogImage>? ViewBlogImages { get; set; }
        public ICollection<ViewBlogComment>? ViewBlogComments { get; set; }
    }
}
