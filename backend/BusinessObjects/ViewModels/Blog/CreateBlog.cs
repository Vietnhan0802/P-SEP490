namespace BusinessObjects.ViewModels.Blog
{
    public class CreateBlog
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public List<CreateImage> CreateImages { get; set; }
    }
}
