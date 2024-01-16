using BusinessObjects.Entities.Post;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BlogComment
    {
        [Key]
        public Guid idBlogComment { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idBlog { get; set; }
        public Blogs? Blogs { get; set; }
        //public ICollection<BlogReply>? BlogReplies { get; set; } = new List<BlogReply>();
        public ICollection<BlogCommentLike>? BlogCommentLikes { get; set; } = new List<BlogCommentLike>();
        public Guid IdUser { get; set; }
    }
}
