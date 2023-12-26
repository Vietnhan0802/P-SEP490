using BusinessObjects.Entities.Projects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Content
{
    public class Post
    {
        public Guid idPost { get; set; } 
        public string Title { get; set; }
        public string Content { get; set; }
        public string Image { get; set; }
        public string Major { get; set; }
        public string Exp { get; set; }
        public int View { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
        public bool IsBlock { get; set; } = false;
        public ICollection<Comment>? Comments { get; set; } = new List<Comment>();
        public Guid idProject { get; set; } 
        public Project? Project { get; set; }    
    }
}
