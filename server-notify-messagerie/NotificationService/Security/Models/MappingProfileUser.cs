using AutoMapper;
using NotificationService.Models;
using NotificationService.Security.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Define the mapping between User and AuthResponseDto
        CreateMap<User, AuthResponseDto>()
            .ForMember(dest => dest.Token, opt => opt.Ignore()) // Ignore Token as it's generated separately
            .ForMember(dest => dest.RefreshToken, opt => opt.Ignore()) // Ignore RefreshToken as it's generated separately
            .ForMember(dest => dest.IsFirstTimeLogin, opt => opt.MapFrom(src => src.IsFirstTimeLogin))
            .ForMember(dest => dest.LastLogin, opt => opt.MapFrom(src => src.LastLogin))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Active))
            .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.MapFrom(src => src.RefreshTokenExpiryTime))
            .ForMember(dest => dest.IsPhoneNumberVerified, opt => opt.MapFrom(src => src.IsPhoneNumberVerified))
            .ForMember(dest => dest.IsTokenPhoneNumberUsed, opt => opt.MapFrom(src => src.IsTokenPhoneNumberUsed))
            .ForMember(dest => dest.TokenPhone, opt => opt.MapFrom(src => src.TokenPhone))
            .ForMember(dest => dest.PhoneNumberExpiredAt, opt => opt.MapFrom(src => src.PhoneNumberExpiredAt))
            .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.AvatarUrl))
            .ForMember(dest => dest.TokenEmail, opt => opt.MapFrom(src => src.TokenEmail));
            
    }
}
