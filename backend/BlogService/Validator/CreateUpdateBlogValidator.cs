﻿using BusinessObjects.ViewModels.Blog;
using FluentValidation;

namespace BlogService.Validator
{
    public class CreateUpdateBlogValidator : AbstractValidator<CreateUpdateBlog>
    {
        public CreateUpdateBlogValidator()
        {
            RuleFor(x => x.title).NotEmpty().WithMessage("The title shouldn't empty!")
                                 .MaximumLength(300).WithMessage("The title must less than 300 characters!");
            RuleFor(x => x.content).NotEmpty().WithMessage("The content shouldn't empty")
                                   .MaximumLength(2000).WithMessage("The content must less than 2000 characters!");
        }
    }
}
