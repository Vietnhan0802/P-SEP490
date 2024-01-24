using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class Blogg
    {
        [Key]
        public Guid idBlog { get; set; }
        public string? idAccount { get; set; }
        public string? title { get; set; }
        public string? content { get; set; }
        public int view { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<BloggImage> BloggImages { get; set; }
        public ICollection<BloggLike> BloggLikes { get; set; }
        public ICollection<BloggComment> BloggComments { get; set; }
    }
}
