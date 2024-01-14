using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class ProjectInvitation
    {
        [Key]
        public Guid idProjectInvitation { get; set; }
        public string? idAccount { get; set; }
        public Guid idProject { get; set; }
        public bool isAccept { get; set; }
        public DateTime confirmedDate { get; set; }
        public DateTime createdDate { get; set; }
        public ProjectInfo? Project { get; set; }
    }
}
