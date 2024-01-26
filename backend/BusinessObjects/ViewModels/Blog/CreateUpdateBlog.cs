namespace BusinessObjects.ViewModels.Blog
{
    public class CreateUpdateBlog
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public List<CreateUpdateImageBlog>? CreateUpdateImageBlogs { get; set; }
    }
}
