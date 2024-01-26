using BusinessObjects.Entities.Post;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BloggComment
    {
        [Key]
        public Guid idBlogComment { get; set; }
        public string? idAccount { get; set; }
        public Guid idBlog { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public Blogg? Blogg { get; set; }
        public ICollection<BloggReply>? BloggReplies { get; set; }
        public ICollection<BloggCommentLike>? BloggCommentLikes { get; set; }
    }
}
