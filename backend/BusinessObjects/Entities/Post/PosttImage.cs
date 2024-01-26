using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Entities.Post
{
    public class PosttImage
    {
        [Key]
        public Guid idPostImage { get; set; }
        public Guid idPost { get; set; }
        public string? image { get; set; }
        public DateTime createdDate { get; set; }
        public Postt? Postt { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
