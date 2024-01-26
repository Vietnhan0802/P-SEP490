using BusinessObjects.Entities.Blog;

namespace BusinessObjects.ViewModels.Blog
{
    public class ViewBlogReply
    {
        public Guid idBlogReply { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public Guid idBlogComment { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<BloggReplyLike>? BloggReplyLikes { get; set; }
    }
}
