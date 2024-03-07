using BusinessObjects.ViewModels.Credential;
using FluentValidation;

namespace Credential.Validator
{
    public class UpdateDegreeValidator : AbstractValidator<CreateUpdateDegree>
    {
        public UpdateDegreeValidator()
        {
            RuleFor(x => x.name).MaximumLength(300).WithMessage("The name must less than 300 characters!");
            RuleFor(x => x.institution).MaximumLength(300).WithMessage("The institution must less than 300 characters!");
        }
    }
}
