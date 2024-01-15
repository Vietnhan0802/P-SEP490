using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Follow;
using BusinessObjects.Entities.Projects;
using BusinessObjects.ViewModels.User;
using Follow.Data;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("GetFollowings/{idAccount}")]
        public async Task<Response> GetFollowing(string idAccount)
        {
            var following = await _context.Followers.Where(x => x.idAccount == idAccount).Select(x => x.idOwner).ToListAsync();

            return new Response(HttpStatusCode.OK, "GetFollowings is success!", following);
        }

        [HttpGet("GetTotalFollowings/{idAccount}")]
        public async Task<Response> GetTotalFollowings(string idAccount)
        {
            var totalFollowing = await _context.Followers.CountAsync(x => x.idAccount == idAccount);

            return new Response(HttpStatusCode.OK, "GetTotalFollowings is success!", totalFollowing);
        }

        [HttpGet("GetFollowers/{idAccount}")]
        public async Task<Response> GetFollowers(string idAccount)
        {
            var following = await _context.Followers.Where(x => x.idOwner == idAccount).Select(x => x.idAccount).ToListAsync();

            return new Response(HttpStatusCode.OK, "GetFollowers is success!", following);
        }

        [HttpGet("GetTotalFollowers/{idAccount}")]
        public async Task<Response> GetTotalFollowers(string idAccount)
        {
            var totalFollower = await _context.Followers.CountAsync(x => x.idOwner == idAccount);

            return new Response(HttpStatusCode.OK, "GetTotalFollowings is success!", totalFollower);
        }

        [HttpPost("Following/{idFollowed}/{idFollower}")]
        public async Task<Response> Following(string idAccount, string idOwner)
        {
            Follower following = new Follower()
            {
                idAccount = idAccount,
                idOwner = idOwner,
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
    }
}
