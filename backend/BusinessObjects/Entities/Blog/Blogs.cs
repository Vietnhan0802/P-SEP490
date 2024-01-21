using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class Blogs
    {
        [Key]
        public Guid idBlog { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int View { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
        public Guid IdUser { get; set; }
        public ICollection<BlogComment>? BlogComments { get; set; } = new List<BlogComment>();
        public ICollection<BlogLike>? BlogLikes { get; set; } = new List<BlogLike>();
    }
}
