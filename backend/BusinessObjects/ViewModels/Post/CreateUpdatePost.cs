namespace BusinessObjects.ViewModels.Post
{
    public class CreateUpdatePost
    {
        public string? title { get; set; }
        public string? content { get; set; }
        public ICollection<CreateUpdatePostImage>? CreateUpdatePostImages { get; set; }
    }
}
