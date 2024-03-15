using BusinessObjects.ViewModels.Project;
using FluentValidation;

namespace Project.Validator
{
    public class ProjectUpdateValidator : AbstractValidator<ProjectInfoUpdate>
    {
        public ProjectUpdateValidator()
        {
            RuleFor(x => x.name).NotEmpty().WithMessage("The name shouldn't empty!");
            RuleFor(x => x.description).NotEmpty().WithMessage("The description shouldn't empty!");
            RuleFor(x => x.process).NotEmpty().WithMessage("The process shouldn't empty!");
            RuleFor(x => x.visibility).NotEmpty().WithMessage("The visibility shouldn't empty!");
            RuleFor(x => x.namePosition).NotEmpty().WithMessage("The PositionCreateUpdates shouldn't empty!");
            RuleFor(x => x.ImageFile).NotEmpty().WithMessage("The ImageFile shouldn't empty!");
        }
    }
}
