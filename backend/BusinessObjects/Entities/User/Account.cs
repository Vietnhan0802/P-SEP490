using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities.User
{
    public class Account : IdentityUser
    {
        public string? fullName { get; set; }
        public DateTime? date { get; set; }
        public bool? isMale { get; set; }
        public string? tax { get; set; }
        public string? address { get; set; }
        public string? avatar { get; set; }
        public string? description { get; set; }
        public bool? isVerified { get; set; }
        public bool? isBlock { get; set; } 
        public DateTime createdDate { get; set; }
    }
}
