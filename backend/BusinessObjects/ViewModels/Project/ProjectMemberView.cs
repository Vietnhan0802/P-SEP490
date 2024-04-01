using BusinessObjects.Entities.Projects;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectMemberView
    {
        public Guid idProjectMember { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public string? email { get; set; }
        public string? avatar { get; set; }
        public bool isVerified { get; set; }
        public Guid? idProject { get; set; }
        public string? nameProject { get; set; }
        public Guid? idPosition { get; set; }
        public string? namePosition { get; set; }
        public string? cvUrl { get; set; }
        public bool isAcept { get; set; }
        public DateTime createdDate { get; set; }
        [NotMapped]
        public string? cvUrlFile { get; set; }
    }
}
