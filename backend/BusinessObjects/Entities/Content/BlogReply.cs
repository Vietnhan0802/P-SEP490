using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Content
{
    public class BlogReply
    {
        [Key]
        public Guid idBlogReply { get; set; } 
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idBlogComment { get; set; } 
        public BlogComment? BlogComment { get; set; }
        public Guid IdUser { get; set; }
    }
}
