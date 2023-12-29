using BusinessObjects.Enums.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Entities.User
{
    public class AppUser : IdentityUser
    {
        public string fullName { get; set; }
        public DateTime birthday { get; set; }
        public bool isMale { get; set; }
        public int tax { get; set; }
        public string address { get; set; }
        public string? avatar { get; set; }
        public bool isBlock { get; set; } = false;
        public DateTime createdDate { get; set; } = DateTime.Now;
    }
}
