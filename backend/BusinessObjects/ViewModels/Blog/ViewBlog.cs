namespace BusinessObjects.ViewModels.Blog
{
    public class ViewBlog
    {
        public Guid idBlog { get; set; }
        public string idAccount { get; set; }
        public string fullName { get; set; }
        public string avatar { get; set; }
        public bool isVerified { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public int view { get; set; }
        public int viewInDate { get; set; }
        public int like { get; set; }
        public bool isLike { get; set; } = false;
        public bool isBlock { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<ViewBlogImage> ViewBlogImages { get; set; }
    }
}
