using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Post
{
    public class PosttLike
    {
        [Key]
        public Guid idPostLike { get; set; }
        public string idAccount { get; set; }
        public Guid idPost { get; set; }
        public DateTime createdDate { get; set; }
        public Postt Postt { get; set; }
    }
}
