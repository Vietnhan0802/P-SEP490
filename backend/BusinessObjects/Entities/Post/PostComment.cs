using BusinessObjects.Entities.Content;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Post
{
    public class PostComment
    {
        [Key]
        public Guid idPostComment { get; set; }
        public string Content { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Guid idPost { get; set; }
        public Posts? Post { get; set; }
        public ICollection<PostReply>? PostReplies { get; set; } = new List<PostReply>();
        public ICollection<PostCommentLike>? PostCommentLikes { get; set; } = new List<PostCommentLike>();
        public Guid IdUser { get; set; }
        
    }
}
