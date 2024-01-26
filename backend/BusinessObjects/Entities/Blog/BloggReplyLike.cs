using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BloggReplyLike
    {

        [Key]
        public Guid idBlogReplyLike { get; set; }
        public string? idAccount { get; set; }
        public Guid idBlogReply { get; set; }
        public DateTime createdDate { get; set; }
        public BloggReply? BloggReply { get; set; }
    }
}
