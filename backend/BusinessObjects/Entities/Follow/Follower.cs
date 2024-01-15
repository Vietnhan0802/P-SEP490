using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Follow
{
    public class Follower
    {
        [Key]
        public Guid idFollower { get; set; }
        public string idOwner { get; set; }
        public string idAccount { get; set; }
        public DateTime createdDate { get; set; }
    }
}
