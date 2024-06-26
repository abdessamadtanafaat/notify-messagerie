using AutoMapper;
using NotificationService.Models;

namespace NotificationService.Security.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<RegisterRequestDto, User>() 
            .ForMember(dest=> dest.Password, opt =>opt.MapFrom(src=>src.Password))
            .ForMember(dest => dest.Active, opt => opt.MapFrom(src => false)) // Example mapping
            .ForMember(dest => dest.IsEmailVerified, opt => opt.MapFrom(src => false)) // Example mapping
            .ForMember(dest => dest.IsEmailTokenUsed, opt => opt.MapFrom(src => false)) // Example mapping
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now)) // Example mapping
            .ForMember(dest => dest.Id, opt => opt.Ignore()); // Ignore Id mapping
    }
}