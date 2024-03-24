using BusinessObjects.Enums.Interaction.Verification;

namespace BusinessObjects.ViewModels.Interaction
{
    public class ViewVerification
    {
        public Guid idVerification { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public string? avatar { get; set; }
        public Status? status { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
