using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Post
{
    public class PostReply
    {
        [Key]
        public Guid idPostReply { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
        public Guid idPostComment { get; set; }
        public PostComment? PostComment { get; set; }
        public ICollection<PostReplyLike>? PostReplyLikes { get; set; } = new List<PostReplyLike>();
    }
}
