using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Communication
{
    public class CreateUpdateMessage
    {
        public string? content { get; set; }
        public string? image { get; set; }
        public string? file { get; set; }
        [NotMapped]
        public IFormFile? ImageFile { get; set; }
        [NotMapped]
        public IFormFile? FileFile { get; set; }
    }
}
