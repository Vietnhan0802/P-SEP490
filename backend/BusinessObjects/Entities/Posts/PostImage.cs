using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class PostImage
    {
        [Key]
        public Guid idPostImage { get; set; }
        public Guid idPost { get; set; }
        public string? image { get; set; }
        public DateTime createdDate { get; set; }
        public Post? Post { get; set; }
    }
}
