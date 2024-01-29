using AutoMapper;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Communication;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Follow;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Entities.Post;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Entities.User;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Communication;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.Interaction;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.User;

namespace BusinessObjects.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Blogg, CreateUpdateBlog>().ReverseMap();
            CreateMap<Blogg, CreateUpdateImageBlog>().ReverseMap();
            CreateMap<Blogg, ViewBlog>().ReverseMap();
            CreateMap<BloggComment, CreateUpdateBlogComment>().ReverseMap();
            CreateMap<BloggComment, ViewBlogComment>().ReverseMap();
            CreateMap<BloggReply, CreateUpdateBlogReply>().ReverseMap();
            CreateMap<BloggReply, ViewBlogReply>().ReverseMap();

            CreateMap<Conversation, ViewConversation>().ReverseMap();
            CreateMap<Message, CreateUpdateMessage>().ReverseMap();
            CreateMap<Message, ViewMessage>().ReverseMap();

            CreateMap<Verification, ViewVerification>().ReverseMap();

            CreateMap<Postt, CreateUpdatePost>().ReverseMap();
            CreateMap<Postt, CreateUpdateImagePost>().ReverseMap();
            CreateMap<Postt, ViewPost>().ReverseMap();
            CreateMap<PosttComment, CreateUpdatePostComment>().ReverseMap();
            CreateMap<PosttComment, ViewPostComment>().ReverseMap();
            CreateMap<PosttReply, CreateUpdatePostReply>().ReverseMap();
            CreateMap<PosttReply, ViewPostReply>().ReverseMap();

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

            CreateMap<Conversation, ViewConversation>().ReverseMap();   
        }
    }
}
