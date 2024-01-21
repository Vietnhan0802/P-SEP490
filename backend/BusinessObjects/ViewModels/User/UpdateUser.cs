using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.User
{
    public class UpdateUser
    {
        public string userName { get; set; }
        public string fullName { get; set; }
        public DateTime date { get; set; }
        public bool isMale { get; set; }
        public string phoneNumber { get; set; }
        public int tax { get; set; }
        public string address { get; set; }
        public string description { get; set; }
    }
}
