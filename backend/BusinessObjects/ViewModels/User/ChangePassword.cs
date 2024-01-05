using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.User
{
    public class ChangePassword
    {
        [Required(ErrorMessage = "Password is required.")]
        [RegularExpression("^[A-Za-z0-9]+$", ErrorMessage = "Password should not contain spaces or special characters.")]
        public string Password { get; set; }
        [Required(ErrorMessage = "NewPassword is required.")]
        [RegularExpression("^[A-Za-z0-9]+$", ErrorMessage = "NewPassword should not contain spaces or special characters.")]
        public string NewPassword { get; set; }
    }
}
