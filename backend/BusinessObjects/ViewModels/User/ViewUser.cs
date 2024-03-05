using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.User
{
    public class ViewUser
    {
        public string Id { get; set; }
        public string userName { get; set; }
        public string email { get; set; }
        public string fullName { get; set; }
        public DateTime date { get; set; }
        public bool isMale { get; set; }
        public string phoneNumber { get; set; }
        public string tax { get; set; }
        public string address { get; set; }
        public string avatar { get; set; }
        public string description { get; set; }
        public Guid idVerification { get; set; }
        public bool isBlock { get; set; }
        public int follower { get; set; }
        public int following { get; set; }
        public bool isFollow { get; set; }
        public string role { get; set; }
        public DateTime createdDate { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }

        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
