using BusinessObjects.Enums.Project;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectInfoView
    {
        public Guid idProject { get; set; }
        public string? idAccount { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string avatar { get; set; }
        public Process process { get; set; }
        public Visibility visibility { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
    }
}
