using AutoMapper;
using BusinessObjects.Entities.Blogs;
using BusinessObjects.Entities.Communication;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Follow;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Entities.Notifications;
using BusinessObjects.Entities.Posts;
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
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;

namespace BusinessObjects.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Blog, CreateUpdateBlog>().ReverseMap();
            CreateMap<Blog, CreateUpdateBlogImage>().ReverseMap();
            CreateMap<Blog, ViewBlog>().ReverseMap();
            CreateMap<BlogImage, ViewBlogImage>().ReverseMap();
            CreateMap<BlogComment, ViewBlogComment>().ReverseMap();
            CreateMap<BlogReply, ViewBlogReply>().ReverseMap();

            CreateMap<Conversation, ViewConversation>().ReverseMap();
            CreateMap<Message, CreateUpdateMessage>().ReverseMap();
            CreateMap<Message, ViewMessage>().ReverseMap();

            CreateMap<Degree, CreateUpdateDegree>().ReverseMap();
            CreateMap<Degree, ViewDegree>().ReverseMap();

            CreateMap<FollowList, FollowingView>().ReverseMap();

            CreateMap<AccountReport, ViewAccountReport>().ReverseMap();
            CreateMap<BlogReport, ViewBlogReport>().ReverseMap();
            CreateMap<PostReport, ViewPostReport>().ReverseMap();
            CreateMap<Verification, ViewVerification>().ReverseMap();

            CreateMap<Notification, ViewNotification>().ReverseMap();

            CreateMap<Post, CreateUpdatePost>().ReverseMap();
            CreateMap<Post, CreateUpdatePostImage>().ReverseMap();
            CreateMap<Post, ViewPost>().ReverseMap();
            CreateMap<PostImage, ViewPostImage>().ReverseMap();
            CreateMap<PostComment, ViewPostComment>().ReverseMap();
            CreateMap<PostReply, ViewPostReply>().ReverseMap();

            CreateMap<Position, PositionView>().ReverseMap();
            CreateMap<Project, ProjectInfoCreate>().ReverseMap();
            CreateMap<Project, ProjectInfoUpdate>().ReverseMap();
            CreateMap<Project, ProjectInfoView>().ReverseMap();
            CreateMap<ProjectMember, ProjectInfoView>().ReverseMap();
            CreateMap<ProjectMember, ProjectMemberView>().ReverseMap();
            CreateMap<ProjectMember, ProjectMemberCreateUpdate>().ReverseMap();
            CreateMap<Rating, RatingCreateUpdate>().ReverseMap();
            CreateMap<Rating, RatingViewProject>().ReverseMap();

            CreateMap<Blog, ViewStatistic>().ReverseMap();
            CreateMap<Post, ViewStatistic>().ReverseMap();
            CreateMap<Project, ViewStatistic>().ReverseMap();
            CreateMap<Account, ViewStatistic>().ReverseMap();

            CreateMap<Account, SignUpPerson>().ReverseMap();
            CreateMap<Account, SignUpBusiness>().ReverseMap();
            CreateMap<Account, SignIn>().ReverseMap();
            CreateMap<Account, UpdateUser>().ReverseMap();
            CreateMap<Account, UpdateAvatar>().ReverseMap();
            CreateMap<Account, ViewUser>().ReverseMap();
        }
    }
}
