namespace BusinessObjects.ViewModels.Post
{
    public class CreateUpdatePost
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public string? major { get; set; }
        public string? exp { get; set; }
        public List<CreateUpdateImagePost>? CreateUpdateImagePosts { get; set; }
    }
}
