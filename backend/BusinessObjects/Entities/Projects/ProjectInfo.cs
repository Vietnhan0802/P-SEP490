using BusinessObjects.Entities.Content;
using BusinessObjects.Enums.Project;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Projects
{
    public class ProjectInfo
    {
        [Key]
        public Guid idProject { get; set; }
        public string? idAccount { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string avatar { get; set; }
        public bool status { get; set; }
        public Visibility visibility { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<ProjectMember> ProjectMembers { get; set; }
        public ICollection<Post> Posts { get; set; } = new List<Post>();

    }
}
