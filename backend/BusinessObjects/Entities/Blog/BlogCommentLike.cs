using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BlogCommentLike
    {
        [Key]
        public Guid idBlogCommentLike { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idBlogComment { get; set; }
        public BlogComment? BlogComment { get; set; }
    }
}
