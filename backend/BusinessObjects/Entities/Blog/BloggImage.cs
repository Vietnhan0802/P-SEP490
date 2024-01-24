using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Blog
{
    public class BloggImage
    {
        [Key]
        public Guid idBlogImage { get; set; }
        public Guid idBlog { get; set; }
        public string image { get; set; }
        public DateTime createdDate { get; set; }
        public Blogg Blogg { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
