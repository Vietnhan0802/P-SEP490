namespace BusinessObjects.ViewModels.Blog
{
    public class CreateUpdateBlog
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public List<CreateUpdateImage> CreateUpdateImages { get; set; }
    }
}
