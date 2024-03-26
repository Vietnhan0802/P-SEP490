using BusinessObjects.Enums.Interaction.Verification;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Interaction
{
    public class Verification
    {
        [Key]

        public Guid idVerification { get; set; }
        public string idAccount { get; set; }
        public Status? status { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
