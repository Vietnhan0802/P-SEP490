using BusinessObjects.Enums.Project;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectInfoCreate
    {
        public string name { get; set; }
        public string description { get; set; }
        public string avatar { get; set; }
        public Process process { get; set; }
        public Visibility visibility { get; set; }
    }
}
