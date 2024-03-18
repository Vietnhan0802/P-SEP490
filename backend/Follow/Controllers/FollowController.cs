using AutoMapper;
using BusinessObjects.Entities.Follow;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.Notification;
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

        public string NotifyApiUrl { get; }
        public string UserApiUrl { get; }

        public FollowController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            NotifyApiUrl = "https://localhost:7009/api/Notification";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpPost("CreateNotificationFollow/{idSender}/{idReceiver}")]
        private async Task<IActionResult> CreateNotificationFollow(string idSender, string idReceiver)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationFollow/{idSender}/{idReceiver}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
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
        public async Task<int> GetTotalFollowings(string idOwner)
        {
            var totalFollowing = await _context.Followers.CountAsync(x => x.idOwner == idOwner);
            return totalFollowing;
        }

        [HttpGet("GetTotalFollowers/{idOwner}")]
        public async Task<int> GetTotalFollowers(string idOwner)
        {
            var totalFollower = await _context.Followers.CountAsync(x => x.idAccount == idOwner);
            return totalFollower;
        }

        [HttpGet("GetAllFollowings/{idOwner}")]
        public async Task<Response> GetAllFollowings(string idOwner)
        {
            var followings = await _context.Followers
                .Where(x => x.idOwner == idOwner)
                .OrderByDescending(x => x.createdDate)
                .AsNoTracking()
                .ToListAsync();
            if (followings == null)
            {
                return new Response(HttpStatusCode.NotFound, "Followings doesn't exists!");
            }
            var result = _mapper.Map<List<FollowingView>>(followings);
            foreach (var following in result)
            {
                var infoUser = await GetNameUserCurrent(following.idAccount!);
                following.email = infoUser.email;
                following.fullName = infoUser.fullName;
                following.avatar = infoUser.avatar;
            }
            return new Response(HttpStatusCode.OK, "Get all followings is success!", result);            
        }

        [HttpGet("GetAllFollowers/{idOwner}")]
        public async Task<Response> GetAllFollowers(string idOwner)
        {
            var followers = await _context.Followers
                .Where(x => x.idAccount == idOwner)
                .OrderByDescending(x => x.createdDate)
                .AsNoTracking()
                .ToListAsync();
            if (followers == null)
            {
                return new Response(HttpStatusCode.NotFound, "Followers doesn't exists!");
            }
            var result = _mapper.Map<List<FollowingView>>(followers);
            foreach (var follower in result)
            {
                var infoUser = await GetNameUserCurrent(follower.idOwner!);
                follower.email = infoUser.email;
                follower.fullName = infoUser.fullName;
                follower.avatar = infoUser.avatar;
            }
            return new Response(HttpStatusCode.OK, "Get followers is success!", result);
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
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    await CreateNotificationFollow(idOwner, idAccount);
                    return new Response(HttpStatusCode.NoContent, "Follow is success!");
                }
                return new Response(HttpStatusCode.NoContent, "Follow is fail!");
            }
            else
            {
                _context.Followers.Remove(existFollow);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unfollow is success!");
                }
                return new Response(HttpStatusCode.NoContent, "Unfollow is fail!");
            }
        }

        [HttpGet("GetFollow/{idOwner}/{idAccount}")]
        public async Task<ActionResult<FollowingView>> CheckFollower(string idOwner, string idAccount)
        {
            var follow = await _context.Followers.FirstOrDefaultAsync(x => x.idOwner == idOwner && x.idAccount == idAccount);
            if (follow == null)
            {
                return NotFound("Follow or unfollow is success!");
            }
            return Ok(follow);
        }
    }
}
