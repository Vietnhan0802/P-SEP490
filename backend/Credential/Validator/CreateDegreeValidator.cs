using BusinessObjects.ViewModels.Credential;
using FluentValidation;

namespace Credential.Validator
{
    public class CreateDegreeValidator : AbstractValidator<CreateUpdateDegree>
    {
        public CreateDegreeValidator()
        {
            RuleFor(x => x.name).NotEmpty().WithMessage("The name shouldn't empty!")
                                 .MaximumLength(300).WithMessage("The name must less than 300 characters!");
            RuleFor(x => x.institution).NotEmpty().WithMessage("The institution shouldn't empty")
                                   .MaximumLength(300).WithMessage("The institution must less than 300 characters!");
            RuleFor(x => x.FileFile).NotEmpty().WithMessage("The file shouldn't empty");
        }
    }
}
