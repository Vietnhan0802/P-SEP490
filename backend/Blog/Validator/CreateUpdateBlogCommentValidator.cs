using BusinessObjects.ViewModels.Blog;
using FluentValidation;

namespace Blog.Validator
{
    public class CreateUpdateBlogCommentValidator : AbstractValidator<CreateUpdateBlogComment>
    {
        public CreateUpdateBlogCommentValidator()
        {
            RuleFor(x => x.content).NotEmpty().WithMessage("The comment shouldn't empty!")
                                 .MaximumLength(500).WithMessage("The comment must less than 500 characters!");
        }
    }
}
