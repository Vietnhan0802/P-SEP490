using BusinessObjects.Enums.Interaction.Verification;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Interaction
{
    public class BlogReport
    {
        [Key]
        public Guid idBlogReport { get; set; }
        public string? idReporter { get; set; }
        public Guid? idBloged { get; set; }
        public Status? status { get; set; }
        public string? content { get; set; }
        public DateTime? createdDate { get; set; }
        public DateTime? confirmedDate { get; set; }
    }
}
