using AutoMapper;
using BusinessObjects.Entities.Follow;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.User;
using Follow.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Follow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigins")]
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
        private async Task<ViewUser> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<ViewUser>(strData, option);

            return user!;
        }

        //*------------------------------------------------------------Follow------------------------------------------------------------*//

        [HttpGet("GetTotalFollowings/{idOwner}")]
        public async Task<Response> GetTotalFollowings(string idOwner)
        {
            var totalFollowing = await _context.Followers.CountAsync(x => x.idOwner == idOwner);
            return new Response(HttpStatusCode.OK, "Get total followings is success!", totalFollowing);
        }

        [HttpGet("GetTotalFollowers/{idOwner}")]
        public async Task<Response> GetTotalFollowers(string idOwner)
        {
            var totalFollower = await _context.Followers.CountAsync(x => x.idAccount == idOwner);
            return new Response(HttpStatusCode.OK, "Get total followings is success!", totalFollower);
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
                var infoUser = await GetNameUserCurrent(following.idAccount!);
                following.fullName = infoUser.fullName;
                following.avatar = infoUser.avatar;
            }
            return new Response(HttpStatusCode.OK, "Get all followings is success!", followings);            
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
                var infoUser = await GetNameUserCurrent(follower.idAccount!);
                follower.fullName = infoUser.fullName;
                follower.avatar = infoUser.avatar;
            }
            return new Response(HttpStatusCode.OK, "Get followers is success!", followers);
        }

        [HttpPost("FollowOrUnfollow/{idOwner}/{idAccount}")]
        public async Task<Response> FollowOrUnfollow(string idOwner, string idAccount)
        {
            var existFollow = await _context.Followers.FirstOrDefaultAsync(x => x.idAccount == idAccount && x.idOwner == idOwner);
            if (existFollow == null)
            {
                Follower following = new Follower()
                {
                    idOwner = idOwner,
                    idAccount = idAccount,
                    createdDate = DateTime.Now,
                };
                await _context.Followers.AddAsync(following);
            }
            else
            {
                _context.Followers.Remove(existFollow);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Follow or unfollow is success!");
        }

        /*public bool CheckFollower()
        {
            return _context.Followers.Any();
        }*/
    }
}
