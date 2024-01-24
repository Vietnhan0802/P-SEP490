using BusinessObjects.Entities.Post;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BloggReply
    {
        [Key]
        public Guid idBlogReply { get; set; }
        public string? idAccount { get; set; }
        public Guid idBlogComment { get; set; }
        public string? content { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public BloggComment BloggComment { get; set; }
        public ICollection<BloggReplyLike> BloggReplyLikes { get; set; }
    }
}
