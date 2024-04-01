using BusinessObjects.Enums.Interaction.Verification;

namespace BusinessObjects.ViewModels.Interaction
{
    public class ViewAccountReport
    {
        public Guid idAccountReport { get; set; }
        public string idReporter { get; set; }
        public string? emailReporter { get; set; }
        public string? nameReporter { get; set; }
        public string? avatarReporter { get; set; }
        public string idReported { get; set; }
        public string? emailReported { get; set; }
        public string? nameReported { get; set; }
        public string? avatarReported { get; set; }
        public bool isVerified { get; set; }
        public string? content { get; set; }
        public Status? status { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
