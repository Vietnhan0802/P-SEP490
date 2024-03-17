using BusinessObjects.ViewModels.User;
using FluentValidation;

namespace User.Validator
{
    public class UpdateUserValidator : AbstractValidator<UpdateUser>
    {
        public UpdateUserValidator()
        {
            RuleFor(x => x.fullName).MinimumLength(2).WithMessage("Full name must be at least 2 characters!")
                                    .MaximumLength(50).WithMessage("Full name must be less than 50 characters!");
            RuleFor(x => x.phoneNumber).Matches(@"^0\d{9,10}$").WithMessage("Phone invalid format!");
            RuleFor(x => x.tax).Matches(@"^\d{10}(\d{3})?$").WithMessage("Tax invalid format!");
            RuleFor(x => x.address).MaximumLength(100).WithMessage("Address must be less than 100 characters!");
            RuleFor(x => x.description).MaximumLength(750).WithMessage("Description must be less than 750 characters!");
        }
    }
}
