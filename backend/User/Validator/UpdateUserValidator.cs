using BusinessObjects.ViewModels.User;
using FluentValidation;

namespace User.Validator
{
    public class UpdateUserValidator : AbstractValidator<UpdateUser>
    {
        public UpdateUserValidator()
        {
            RuleFor(x => x.userName).NotEmpty().WithMessage("User name shouldn't empty!");
            RuleFor(x => x.fullName).NotEmpty().WithMessage("Full name shouldn't empty!")
                                    .MinimumLength(2).WithMessage("Full name must be at least 2 characters!")
                                    .MaximumLength(50).WithMessage("Full name must be less than 50 characters!");
            RuleFor(x => x.date).NotEmpty().WithMessage("Birthday shouldn't empty!");
            RuleFor(x => x.isMale).NotEmpty().WithMessage("Gender shouldn't empty!");
            RuleFor(x => x.phoneNumber).NotEmpty().WithMessage("Phone shouldn't empty!")
                                 .Matches(@"^0\d{9,10}$").WithMessage("Phone invalid format!");
            RuleFor(x => x.tax).NotEmpty().WithMessage("Tax shouldn't empty!")
                               .Matches(@"^\d{10}(\d{3})?$").WithMessage("Tax invalid format!");
            RuleFor(x => x.address).NotEmpty().WithMessage("Address shouldn't empty!")
                                   .MaximumLength(100).WithMessage("Address must be less than 100 characters!");
            RuleFor(x => x.description).NotEmpty().WithMessage("Description shouldn't empty!")
                                   .MaximumLength(750).WithMessage("Description must be less than 750 characters!");
        }
    }
}
