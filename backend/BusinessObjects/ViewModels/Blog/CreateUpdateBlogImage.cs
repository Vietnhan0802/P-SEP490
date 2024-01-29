using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Blog
{
    public class CreateUpdateBlogImage
    {
        public string? image { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
