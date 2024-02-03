using BusinessObjects.ViewModels.Post;
using FluentValidation;

namespace Post.Validator
{
    public class CreateUpdatePostCommentValidatior : AbstractValidator<CreateUpdatePostComment>
    {
        public CreateUpdatePostCommentValidatior()
        {
            RuleFor(x => x.content).NotEmpty().WithMessage("The comment shouldn't empty!")
                                 .MaximumLength(500).WithMessage("The comment must less than 500 characters!");
        }
    }
}
