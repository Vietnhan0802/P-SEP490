using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Content
{
    public class BlogComment
    {
        [Key]
        public Guid idBlogComment { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idBlog { get; set; }
        public Blogs? Blog { get; set; }
        public ICollection<BlogReply>? Replies { get; set; } = new List<BlogReply>();
        public Guid IdUser { get; set; }
    }
}
