using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Content
{
    public class Comment
    {
        public Guid idComment { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idPost { get; set; }
        public Post? Post { get; set; }
        public ICollection<Reply>? Replies { get; set; } = new List<Reply>();
    }
}
