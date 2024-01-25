using AutoMapper;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Communication;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Follow;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Entities.User;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Communication;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.User;

namespace BusinessObjects.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Blogg, CreateBlog>().ReverseMap();
            CreateMap<Blogg, CreateImage>().ReverseMap();
            CreateMap<Blogg, UpdateBlog>().ReverseMap();
            CreateMap<Blogg, UpdateImage>().ReverseMap();
            CreateMap<Blogg, ViewBlog>().ReverseMap();
            CreateMap<BloggComment, CreateBlogComment>().ReverseMap();
            CreateMap<BloggComment, UpdateBlogComment>().ReverseMap();
            CreateMap<BloggComment, ViewBlogComment>().ReverseMap();

            CreateMap<AppUser, SignUpPerson>().ReverseMap();
            CreateMap<AppUser, SignUpBusiness>().ReverseMap();
            CreateMap<AppUser, SignIn>().ReverseMap();
            CreateMap<AppUser, UpdateUser>().ReverseMap();
            CreateMap<AppUser, UpdateAvatar>().ReverseMap();
            CreateMap<AppUser, ViewUser>().ReverseMap();

            CreateMap<Degree, CreateDegree>().ReverseMap();
            CreateMap<Degree, UpdateDegree>().ReverseMap();
            CreateMap<Degree, ViewDegree>().ReverseMap();

            CreateMap<ProjectInfo, ProjectInfoView>().ReverseMap();
            CreateMap<ProjectInfo, ProjectInfoCreate>().ReverseMap();
            CreateMap<ProjectInfo, ProjectInfoUpdate>().ReverseMap();
            CreateMap<ProjectMember, ProjectMemberView>().ReverseMap();

            CreateMap<Follower, FollowingView>().ReverseMap();

            CreateMap<Conversation, ConversationView>().ReverseMap();   
        }
    }
}
