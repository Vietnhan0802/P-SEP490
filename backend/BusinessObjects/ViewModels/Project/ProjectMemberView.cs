using BusinessObjects.Entities.Projects;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectMemberView
    {
        public Guid idProjectMember { get; set; }
        public string? idAccount { get; set; }
        public string fullName { get; set; }
        public string avatar { get; set; }
        public Guid? idProject { get; set; }
        public string name { get; set; }
        public bool isAcept { get; set; }
        public DateTime createdDate { get; set; }
    }
}
