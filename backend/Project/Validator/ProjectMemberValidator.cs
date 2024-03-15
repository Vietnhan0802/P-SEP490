using BusinessObjects.ViewModels.Project;
using FluentValidation;

namespace Project.Validator
{
    public class ProjectMemberValidator : AbstractValidator<ProjectMemberCreateUpdate>
    {
        public ProjectMemberValidator()
        {
            RuleFor(x => x.idPosition).NotEmpty().WithMessage("The idPosition shouldn't empty!");
            RuleFor(x => x.cvUrlFile).NotEmpty().WithMessage("The cvUrlFile shouldn't empty!");
        }
    }
}
