using Microsoft.AspNetCore.Http;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectMemberCreateUpdate
    {
        public Guid? idPosition { get; set; }
        public string? cvUrl { get; set; }
        public IFormFile? cvUrlFile { get; set; }
    }
}
