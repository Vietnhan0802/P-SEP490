﻿using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Follow
{
    public class FollowList
    {
        [Key]
        public Guid idFollowList { get; set; }
        public string idOwner { get; set; }
        public string idAccount { get; set; }
        public DateTime createdDate { get; set; }
    }
}
