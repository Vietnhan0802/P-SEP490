using BusinessObjects.ViewModels.Blog;
using FluentValidation;

namespace Blog.Validator
{
    public class CreateUpdateBlogReplyValidator : AbstractValidator<CreateUpdateBlogReply>
    {
        public CreateUpdateBlogReplyValidator()
        {
            RuleFor(x => x.content).NotEmpty().WithMessage("The reply shouldn't empty!")
                                 .MaximumLength(500).WithMessage("The reply must less than 500 characters!");
        }
    }
}
