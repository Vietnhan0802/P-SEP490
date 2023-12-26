using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.User
{
    public class SignIn
    {
        [Required(ErrorMessage = "Email is required!")]
        public string email { get; set; }
        [Required(ErrorMessage = "Password is required!")]
        public string password { get; set; }
    }
}
