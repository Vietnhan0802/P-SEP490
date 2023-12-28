using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.User
{
    public class UpdateUser
    {
        public string fullName { get; set; }
        public DateTime birthday { get; set; }
        public bool isMale { get; set; }
        public string phoneNumber { get; set; }
        public int tax { get; set; }
        public string address { get; set; }
        public string avatar { get; set; }
        [NotMapped]
        public IFormFile imageFile { get; set; }
    }
}
