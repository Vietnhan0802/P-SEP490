using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Post
{
    public class PostCommentLike
    {
        [Key]
        public Guid idPostCommentLike { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idPostComment { get; set; }
        public PostComment? PostComment { get; set; }
    }
}
