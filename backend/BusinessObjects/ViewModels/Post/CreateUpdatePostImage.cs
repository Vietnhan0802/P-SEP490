using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Post
{
    public class CreateUpdatePostImage
    {
        public string? image { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
