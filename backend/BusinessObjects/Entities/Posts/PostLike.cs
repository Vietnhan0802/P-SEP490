using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class PostLike
    {
        [Key]
        public Guid idPostLike { get; set; }
        public string idAccount { get; set; }
        public Guid idPost { get; set; }
        public DateTime createdDate { get; set; }
        public Post? Post { get; set; }
    }
}
