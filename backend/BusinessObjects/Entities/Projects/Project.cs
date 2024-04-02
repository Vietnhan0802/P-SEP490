using BusinessObjects.Enums.Project;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class Project
    {
        [Key]
        public Guid idProject { get; set; }
        public string idAccount { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public string? avatar { get; set; }
        public Process process { get; set; }
        public Visibility visibility { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<Position>? Positions { get; set; }
        public ICollection<ProjectMember>? ProjectMembers { get; set; }
        public ICollection<Rating>? Ratings { get; set; }
    }
}
