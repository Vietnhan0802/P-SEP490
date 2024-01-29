using BusinessObjects.Enums.Interaction.Verification;

namespace BusinessObjects.ViewModels.Interaction
{
    public class ViewAccountReport
    {
        public Guid idReport { get; set; }
        public string? idReporter { get; set; }
        public string? nameReporter { get; set; }
        public string? idReported { get; set; }
        public string? nameReported { get; set; }
        public string? content { get; set; }
        public Status? status { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
