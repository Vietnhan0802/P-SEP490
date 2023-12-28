using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Content
{
    public class PostReply
    {
        [Key]
        public Guid idPostReply { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idPostComment { get; set; }
        public PostComment? PostComment { get; set; }
        public Guid IdUser { get; set; }
    }
}
