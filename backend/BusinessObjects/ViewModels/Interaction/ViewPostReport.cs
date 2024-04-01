using BusinessObjects.Enums.Interaction.Verification;

namespace BusinessObjects.ViewModels.Interaction
{
    public class ViewPostReport
    {
        public Guid idPostReport { get; set; }
        public string idReporter { get; set; }
        public string? emailReporter { get; set; }
        public string? nameReporter { get; set; }
        public string? avatarReporter { get; set; }
        public bool isVerifiedReporter { get; set; }
        public Guid idPosted { get; set; }
        public string? accountPosted { get; set; }
        public string? emailPosted { get; set; }
        public string? namePosted { get; set; }
        public string? avatarPosted { get; set; }
        public bool isVerifiedPosted { get; set; }
        public string? titlePost { get; set; }
        public string? contentPost { get; set; }
        public string? title { get; set; }
        public Status? status { get; set; }
        public string? content { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
