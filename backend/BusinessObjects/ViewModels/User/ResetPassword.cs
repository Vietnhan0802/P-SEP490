﻿using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.ViewModels.User
{
    public class ResetPassword
    {
        public string? Password { get; set; }
        [Required(ErrorMessage = "ConfirmPassword is required.")]
        [Compare("Password", ErrorMessage = "Password and ConfirmPassword must match.")]
        public string? ConfirmPassword { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string? Email { get; set; }
        public string? Token { get; set; }
    }
}
