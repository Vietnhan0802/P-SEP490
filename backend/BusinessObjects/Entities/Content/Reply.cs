using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Content
{
    public class Reply
    {
        public Guid idReply { get; set; } 
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idComment { get; set; } 
        public Comment? Comment { get; set; }    
    }
}
