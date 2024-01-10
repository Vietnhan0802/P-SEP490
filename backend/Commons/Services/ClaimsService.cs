using Commons.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Commons.Services
{
    public class ClaimsService : IClaimService
    {
        public ClaimsService(IHttpContextAccessor httpContextAccessor)
        {
            var Id = httpContextAccessor.HttpContext?.User?.FindFirstValue("userId");
            GetCurrentUserId = string.IsNullOrEmpty(Id) ? Guid.Empty : Guid.Parse(Id);
        }

        public Guid GetCurrentUserId { get; }
    }
}
