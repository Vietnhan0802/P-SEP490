using BusinessObjects.Entities.Post;

namespace BusinessObjects.ViewModels.Post
{
    public class ViewPostReply
    {
        public Guid idPostReply { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public string? avatar { get; set; }
        public Guid idPostComment { get; set; }
        public string? content { get; set; }
        public int like { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
    }
}
