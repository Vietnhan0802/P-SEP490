using Microsoft.AspNetCore.Identity;

namespace BusinessObjects.Entities.User
{
    public class AppUser : IdentityUser
    {
        public string fullName { get; set; }
        public DateTime birthday { get; set; }
        public bool? isMale { get; set; }
        public int tax { get; set; }
        public string address { get; set; }
        public string? avatar { get; set; }
        public Guid idVerification { get; set; }
        public bool isBlock { get; set; } = false;
        public DateTime createdDate { get; set; } = DateTime.Now;
    }
}
