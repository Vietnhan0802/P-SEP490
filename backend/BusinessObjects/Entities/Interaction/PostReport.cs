using BusinessObjects.Enums.Interaction.Verification;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Interaction
{
    public class PostReport
    {
        [Key]
        public Guid idPostReport { get; set; }
        public string idReporter { get; set; }
        public Guid idPosted { get; set; }
        public Status? status { get; set; }
        public string? content { get; set; }
        public DateTime createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
