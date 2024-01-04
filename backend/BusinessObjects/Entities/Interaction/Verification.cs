using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Interaction
{
    public class Verification
    {
        [Key]

        public Guid Id { get; set; }
        public Guid IdAccount { get; set; }
        public bool? IsAccept { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
