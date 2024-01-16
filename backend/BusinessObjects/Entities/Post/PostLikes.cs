using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Post
{
    public class PostLikes
    {
        [Key]
        public Guid idPostLikes { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsDeleted { get; set; } = false;
        public Guid idPost { get; set; }
        public Posts? Post { get; set; }
    }
}
