using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.User
{
    public class ChangePassword
    {
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
        [Required(ErrorMessage = "NewPassword is required.")]
        public string NewPassword { get; set; }
    }
}
