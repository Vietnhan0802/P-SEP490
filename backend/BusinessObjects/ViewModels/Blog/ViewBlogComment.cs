namespace BusinessObjects.ViewModels.Blog
{
    public class ViewBlogComment
    {
        public Guid idBlogComment { get; set; }
        public string idAccount { get; set; }
        public string fullName { get; set; }
        public string avatar { get; set; }
        public Guid idBlog { get; set; }
        public string content { get; set; }
        public int like { get; set; }
        public bool isLike { get; set; } = false;
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<ViewBlogReply> ViewBlogReplies { get; set; }
    }
}
