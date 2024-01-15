using BusinessObjects.Entities.Projects;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectInvitationView
    {
        [Key]
        public Guid idProjectInvitation { get; set; }
        public string? idAccount { get; set; }
        public string userName { get; set; }
        public Guid idProject { get; set; }
        public string projectName { get; set; }
        public bool isAccept { get; set; }
        public DateTime createdDate { get; set; }
    }
}
