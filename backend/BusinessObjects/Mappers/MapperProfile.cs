using AutoMapper;
using BusinessObjects.Entities.User;
using BusinessObjects.ViewModels.User;

namespace BusinessObjects.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<AppUser, SignUpForPerson>().ReverseMap();
            CreateMap<AppUser, SignUpForBusiness>().ReverseMap();
            CreateMap<AppUser, SignIn>().ReverseMap();
            CreateMap<AppUser, Account>().ReverseMap();
        }
    }
}
