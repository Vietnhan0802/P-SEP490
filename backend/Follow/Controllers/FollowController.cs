using AutoMapper;
using BusinessObjects.Entities.Follow;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.User;
using Follow.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Follow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public FollowController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpGet("GetNameUserCurrent/{idUser}")]
        private async Task<string> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<string>(strData, option);
            return user;
        }

        [HttpGet("GetAllFollowings/{idOwner}")]
        public async Task<Response> GetAllFollowings(string idOwner)
        {
            var followings = await _context.Followers
                .Where(x => x.idOwner == idOwner)
                .Select(x => new FollowingView
                {
                    idAccount = x.idAccount
                })
                .OrderByDescending(x => x.createdDate)
                .AsNoTracking()
                .ToListAsync();
            if (followings == null)
            {
                return new Response(HttpStatusCode.NotFound, "Followings doesn't exists!");
            }
            foreach (var following in followings)
            {
                following.fullName = await GetNameUserCurrent(following.idAccount);
            }
            return new Response(HttpStatusCode.OK, "Get all followings is success!", followings);            
        }

        [HttpGet("GetTotalFollowings/{idOwner}")]
        public async Task<Response> GetTotalFollowings(string idOwner)
        {
            var totalFollowing = await _context.Followers.CountAsync(x => x.idOwner == idOwner);
            return new Response(HttpStatusCode.OK, "Get total followings is success!", totalFollowing);
        }

        [HttpGet("GetAllFollowers/{idOwner}")]
        public async Task<Response> GetAllFollowers(string idOwner)
        {
            var followers = await _context.Followers
                .Where(x => x.idAccount == idOwner)
                .Select(x => new FollowingView
                {
                    idAccount = x.idOwner
                })
                .OrderByDescending(x => x.createdDate)
                .AsNoTracking()
                .ToListAsync();
            if (followers == null)
            {
                return new Response(HttpStatusCode.NotFound, "Followers doesn't exists!");
            }
            foreach (var follower in followers)
            {
                follower.fullName = await GetNameUserCurrent(follower.idAccount);
            }
            return new Response(HttpStatusCode.OK, "Get followers is success!", followers);
        }

        [HttpGet("GetTotalFollowers/{idOwner}")]
        public async Task<Response> GetTotalFollowers(string idOwner)
        {
            var totalFollower = await _context.Followers.CountAsync(x => x.idAccount == idOwner);
            return new Response(HttpStatusCode.OK, "Get total followings is success!", totalFollower);
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
