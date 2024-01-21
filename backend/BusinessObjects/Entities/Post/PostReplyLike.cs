using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Post
{
    public class PostReplyLike
    {
        [Key]
        public Guid idPostReplyLike { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idPostReply { get; set; }
        public PostReply? PostReply { get; set; }
    }
}
