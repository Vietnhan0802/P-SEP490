using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.User
{
    public class SignIn
    {
        [Required(ErrorMessage = "Email is required!")]
        [StringLength(50)]
        public string? email { get; set; }
        [Required(ErrorMessage = "Password is required!")]
        [DataType(DataType.Password)]
        public string? password { get; set; }
    }
}
