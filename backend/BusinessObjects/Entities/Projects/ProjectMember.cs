using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class ProjectMember
    {
        [Key]
        public Guid idProjectMember { get; set; }
        public string? idAccount { get; set; }
        public Guid? idProject { get; set; }
        public bool? isAcept { get; set; }
        public DateTime confirmedDate { get; set; }
        public DateTime createdDate { get; set; }
        public ProjectInfo? Project { get; set; }
    }
}
