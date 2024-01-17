using AutoMapper;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Post;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Entities.User;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.BlogComments;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.User;

namespace BusinessObjects.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<AppUser, SignUpPerson>().ReverseMap();
            CreateMap<AppUser, SignUpBusiness>().ReverseMap();
            CreateMap<AppUser, SignIn>().ReverseMap();
            CreateMap<AppUser, ViewUser>().ReverseMap();
            CreateMap<AppUser, UpdateUser>().ReverseMap();

            CreateMap<Degree, CreateDegree>().ReverseMap();
            CreateMap<Degree, UpdateDegree>().ReverseMap();
            CreateMap<Degree, ViewDegree>().ReverseMap();

            CreateMap<ProjectInfo, ProjectInfoView>().ReverseMap();
            CreateMap<ProjectInfo, ProjectInfoCreate>().ReverseMap();
            CreateMap<ProjectInfo, ProjectInfoUpdate>().ReverseMap();

            CreateMap<ProjectMember, ProjectMemberView>().ReverseMap();

            CreateMap<ProjectInvitation, ProjectInvitationView>().ReverseMap();

            CreateMap<Posts, CreatePostViewModel>().ReverseMap();
            CreateMap<Posts, UpdatePostViewModel>().ReverseMap();

            CreateMap<Blogs, CreateBlogViewModel>().ReverseMap();   
            CreateMap<Blogs, UpdateBlogViewModel>().ReverseMap();

            CreateMap<BlogComment, CreateCommentBlog>().ReverseMap();
            CreateMap<BlogComment, UpdateCommentBlog>().ReverseMap();

        }
    }
}
