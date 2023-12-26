using BusinessObjects.Entities.Content;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Projects
{
    public class Project
    {
        public int idProject { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Avt { get; set; }
        public bool Status { get; set; }
        public string Visibility { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public ICollection<Post> Posts { get; set; } = new List<Post>();

    }
}
