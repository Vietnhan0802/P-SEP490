using BusinessObjects.Entities.Follow;
using BusinessObjects.ViewModels.User;
using Follow.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Follow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly AppDBContext _context;

        public FollowController(AppDBContext context)
        {
            _context = context;
        }

        [HttpGet("GetFollowings/{idOwner}")]
        public async Task<Response> GetFollowings(string idOwner)
        {
            var following = await _context.Followers.Where(x => x.idOwner == idOwner).Select(x => x.idAccount).ToListAsync();
            return new Response(HttpStatusCode.OK, "GetFollowings is success!", following);
        }

        [HttpGet("GetTotalFollowings/{idOwner}")]
        public async Task<Response> GetTotalFollowings(string idOwner)
        {
            var totalFollowing = await _context.Followers.CountAsync(x => x.idOwner == idOwner);
            return new Response(HttpStatusCode.OK, "GetTotalFollowings is success!", totalFollowing);
        }

        [HttpGet("GetFollowers/{idOwner}")]
        public async Task<Response> GetFollowers(string idOwner)
        {
            var following = await _context.Followers.Where(x => x.idAccount == idOwner).Select(x => x.idOwner).ToListAsync();
            return new Response(HttpStatusCode.OK, "GetFollowers is success!", following);
        }

        [HttpGet("GetTotalFollowers/{idOwner}")]
        public async Task<Response> GetTotalFollowers(string idOwner)
        {
            var totalFollower = await _context.Followers.CountAsync(x => x.idAccount == idOwner);
            return new Response(HttpStatusCode.OK, "GetTotalFollowings is success!", totalFollower);
        }

        [HttpPost("Following/{idOwner}/{idAccount}")]
        public async Task<Response> Following(string idOwner, string idAccount)
        {
            Follower following = new Follower()
            {
                idOwner = idOwner,
                idAccount = idAccount,
                createdDate = DateTime.Now,
            };
            await _context.Followers.AddAsync(following);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Follow is success!", following);
        }

        [HttpDelete("UnFollow")]
        public async Task<Response> UnFollowing(string idAccount, string idOwner)
        {
            var following = await _context.Followers.FirstOrDefaultAsync(x => x.idAccount == idAccount && x.idOwner == idOwner);
            if (following == null)
            {
                return new Response(HttpStatusCode.NotFound, "Follow doesn't exists!");
            }
            _context.Followers.Remove(following);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove Follow is success!");
        }

        public bool CheckFollower()
        {
            return _context.Followers.Any();
        }
    }
}
