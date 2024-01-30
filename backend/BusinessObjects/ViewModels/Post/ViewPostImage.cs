using BusinessObjects.Entities.Post;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.ViewModels.Post
{
    public class ViewPostImage
    {
        public Guid idPostImage { get; set; }
        public Guid idPost { get; set; }
        public string? image { get; set; }
        public DateTime createdDate { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
