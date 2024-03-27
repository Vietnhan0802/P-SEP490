using BusinessObjects.Enums.Interaction.Verification;

namespace BusinessObjects.ViewModels.Interaction
{
    public class ViewBlogReport
    {
        public Guid idBlogReport { get; set; }
        public string idReporter { get; set; }
        public string? emailReporter { get; set; }
        public string? nameReporter { get; set; }
        public string? avatarReporter { get; set; }
        public Guid idBloged { get; set; }
        public string? emailBloged { get; set; }
        public string? nameBloged { get; set; }
        public string? avatarBloged { get; set; }
        public string? titleBlog { get; set; }
        public string? contentBlog { get; set; }
        public string? title { get; set; }
        public Status? status { get; set; }
        public string? content { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
