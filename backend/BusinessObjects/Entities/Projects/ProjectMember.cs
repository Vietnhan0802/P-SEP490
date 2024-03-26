using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class ProjectMember
    {
        [Key]
        public Guid idProjectMember { get; set; }
        public string idAccount { get; set; }
        public Guid? idProject { get; set; }
        public Guid? idPosition { get; set; }
        public Enums.Project.Type type { get; set; }
        public string? cvUrl { get; set; }
        public bool? isAcept { get; set; }
        public DateTime confirmedDate { get; set; }
        public DateTime createdDate { get; set; }
        public Project? Project { get; set; }
        public Position? Position { get; set; }
    }
}
