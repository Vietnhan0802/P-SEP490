using BusinessObjects.Enums.Interaction.Verification;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Interaction
{
    public class AccountReport
    {
        [Key]
        public Guid idAccountReport { get; set; }
        public string idReporter { get; set; }
        public string idReported { get; set; }
        public string? content { get; set; }
        public Status? status { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
