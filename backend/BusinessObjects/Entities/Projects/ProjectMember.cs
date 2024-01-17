using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class ProjectMember
    {
        [Key]
        public Guid idProjectMember { get; set; }
        public string? idAccount { get; set; }
        public Guid? idProject { get; set; }
        public Enums.Project.Type type { get; set; }
        public bool? isAcept { get; set; }
        public DateTime confirmedDate { get; set; }
        public DateTime createdDate { get; set; }
        public ProjectInfo? ProjectInfo { get; set; }
    }
}
