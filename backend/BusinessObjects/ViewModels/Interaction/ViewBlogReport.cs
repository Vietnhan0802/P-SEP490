using BusinessObjects.Enums.Interaction.Verification;

namespace BusinessObjects.ViewModels.Interaction
{
    public class ViewBlogReport
    {
        public Guid idBlogtReport { get; set; }
        public string? idReporter { get; set; }
        public string? nameReporter { get; set; }
        public Guid? idBloged { get; set; }
        public string? title { get; set; }
        public Status? status { get; set; }
        public string? content { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
