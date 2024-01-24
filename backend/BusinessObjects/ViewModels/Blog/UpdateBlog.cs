namespace BusinessObjects.ViewModels.Blog
{
    public class UpdateBlog
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public List<UpdateImage> UpdateImages { get; set; }
    }
}
