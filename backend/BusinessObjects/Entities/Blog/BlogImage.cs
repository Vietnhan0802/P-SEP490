using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BlogImage
    {
        [Key]
        public Guid idBlogImage { get; set; }
        public string imageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
        public Guid idBlog { get; set; }
        public Blogs? Blogs { get; set; }
    }
}
