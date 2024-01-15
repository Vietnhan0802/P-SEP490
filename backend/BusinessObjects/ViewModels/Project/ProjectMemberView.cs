using BusinessObjects.Entities.Projects;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectMemberView
    {
        public string? idAccount { get; set; }
        public Guid? idProject { get; set; }
        public bool isAcept { get; set; }
        public DateTime createdDate { get; set; }
    }
}
