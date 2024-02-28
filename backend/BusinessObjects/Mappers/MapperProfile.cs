using AutoMapper;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Communication;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Follow;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Entities.Notification;
using BusinessObjects.Entities.Post;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Entities.User;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Communication;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.Interaction;
using BusinessObjects.ViewModels.Notification;
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
            CreateMap<Blogg, CreateUpdateBlogImage>().ReverseMap();
            CreateMap<Blogg, ViewBlog>().ReverseMap();
            CreateMap<BloggImage, ViewBlogImage>().ReverseMap();
            CreateMap<BloggComment, ViewBlogComment>().ReverseMap();
            CreateMap<BloggReply, ViewBlogReply>().ReverseMap();

            CreateMap<Conversation, ViewConversation>().ReverseMap();
            CreateMap<Message, CreateUpdateMessage>().ReverseMap();
            CreateMap<Message, ViewMessage>().ReverseMap();

            CreateMap<Degree, CreateDegree>().ReverseMap();
            CreateMap<Degree, UpdateDegree>().ReverseMap();
            CreateMap<Degree, ViewDegree>().ReverseMap();

            CreateMap<Follower, FollowingView>().ReverseMap();

            CreateMap<AccountReport, ViewAccountReport>().ReverseMap();
            CreateMap<BlogReport, ViewBlogReport>().ReverseMap();
            CreateMap<PostReport, ViewPostReport>().ReverseMap();
            CreateMap<Verification, ViewVerification>().ReverseMap();

            CreateMap<Notificationn, ViewNotification>().ReverseMap();

            CreateMap<Postt, CreateUpdatePost>().ReverseMap();
            CreateMap<Postt, CreateUpdatePostImage>().ReverseMap();
            CreateMap<Postt, ViewPost>().ReverseMap();
            CreateMap<PosttImage, ViewPostImage>().ReverseMap();
            CreateMap<PosttComment, ViewPostComment>().ReverseMap();
            CreateMap<PosttReply, ViewPostReply>().ReverseMap();

            CreateMap<ProjectInfo, ProjectInfoView>().ReverseMap();
            CreateMap<ProjectInfo, ProjectInfoCreate>().ReverseMap();
            CreateMap<ProjectInfo, ProjectInfoUpdate>().ReverseMap();
            CreateMap<ProjectMember, ProjectMemberView>().ReverseMap();

            CreateMap<AppUser, SignUpPerson>().ReverseMap();
            CreateMap<AppUser, SignUpBusiness>().ReverseMap();
            CreateMap<AppUser, SignIn>().ReverseMap();
            CreateMap<AppUser, UpdateUser>().ReverseMap();
            CreateMap<AppUser, UpdateAvatar>().ReverseMap();
            CreateMap<AppUser, ViewUser>().ReverseMap();
        }
    }
}
