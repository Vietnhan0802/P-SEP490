using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Post
{
    public class Postt
    {
        [Key]
        public Guid idPost { get; set; }
        public string idAccount { get; set; }
        public Guid idProject { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public string major { get; set; }
        public string exp { get; set; }
        public int view { get; set; }
        public bool isBlock { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<PosttImage> PosttImages { get; set; }
        public ICollection<PosttLike> PosttLikes { get; set; }
        public ICollection<PosttComment> PosttComments { get; set; }
    }
}
