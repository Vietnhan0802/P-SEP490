using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Posts
{
    public class Post
    {
        [Key]
        public Guid idPost { get; set; }
        public string idAccount { get; set; }
        public Guid? idProject { get; set; }
        public string? title { get; set; }
        public string? content { get; set; }
        public int view { get; set; }
        public int viewInDate { get; set; }
        public bool isBlock { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<PostImage>? PostImages { get; set; }
        public ICollection<PostLike>? PostLikes { get; set; }
        public ICollection<PostComment>? PostComments { get; set; }
    }
}
