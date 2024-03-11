using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Credential
{
    public class CreateUpdateDegree
    {
        public string? name { get; set; }
        public string? institution { get; set; }
        public string? file { get; set; }
        [NotMapped]
        public IFormFile FileFile { get; set; }
        [NotMapped]
        public IFormFile? FileSrc { get; set; }
    }
}
