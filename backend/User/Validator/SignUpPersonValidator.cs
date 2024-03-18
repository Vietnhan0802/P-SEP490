using BusinessObjects.ViewModels.User;
using FluentValidation;

namespace User.Validator
{
    public class SignUpPersonValidator : AbstractValidator<SignUpPerson>
    {
        public SignUpPersonValidator()
        {
            RuleFor(x => x.email).NotEmpty().WithMessage("Email shouldn't empty!")
                                 .EmailAddress().WithMessage("Email invalid format!");
            RuleFor(x => x.password).NotEmpty().WithMessage("Password shouldn't empty!");
            RuleFor(x => x.fullName).NotEmpty().WithMessage("Full name shouldn't empty!")
                                    .MinimumLength(2).WithMessage("Full name must be at least 2 characters!")
                                    .MaximumLength(50).WithMessage("Full name must be less than 50 characters!");
            RuleFor(x => x.birthday).NotEmpty().WithMessage("Birthday shouldn't empty!");
            // RuleFor(x => x.isMale).NotEmpty().WithMessage("Gender shouldn't empty!");
            RuleFor(x => x.phone).NotEmpty().WithMessage("Phone shouldn't empty!")
                                 .Matches(@"^0\d{9,10}$").WithMessage("Phone invalid format!");
            RuleFor(x => x.tax).NotEmpty().WithMessage("Tax shouldn't empty!")
                               .Matches(@"^\d{10}(\d{3})?$").WithMessage("Tax invalid format!");
            RuleFor(x => x.address).NotEmpty().WithMessage("Address shouldn't empty!")
                                   .MaximumLength(100).WithMessage("Address must be less than 100 characters!");
        }
    }
}
