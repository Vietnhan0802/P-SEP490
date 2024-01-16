using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BlogReplyLike
    {

        [Key]
        public Guid idBlogReplyLike { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idBlogReply { get; set; }
        public BlogReply? BlogReply { get; set; }
    }
}
