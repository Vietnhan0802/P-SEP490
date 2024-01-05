using AutoMapper;
using BusinessObjects.Entities.User;
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
        }
    }
}
