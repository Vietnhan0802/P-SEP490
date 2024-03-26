using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Blogs
{
    public class BlogComment
    {
        [Key]
        public Guid idBlogComment { get; set; }
        public string idAccount { get; set; }
        public Guid idBlog { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public Blog? Blog { get; set; }
        public ICollection<BlogReply>? BlogReplies { get; set; }
        public ICollection<BlogCommentLike>? BlogCommentLikes { get; set; }
    }
}
