using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Interaction
{
    public class Verification
    {
        [Key]

        public Guid Id { get; set; }
        public string IdAccount { get; set; }
        public bool? IsAccept { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
