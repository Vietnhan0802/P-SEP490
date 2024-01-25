using BusinessObjects.Entities.Blog;

namespace BusinessObjects.ViewModels.Blog
{
    public class ViewBlogComment
    {
        public Guid idBlogComment { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public Guid idBlog { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<BloggReply> BloggReplies { get; set; }
        public ICollection<BloggCommentLike> BloggCommentLikes { get; set; }
    }
}
