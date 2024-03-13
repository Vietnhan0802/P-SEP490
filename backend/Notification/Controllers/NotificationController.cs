using AutoMapper;
using BusinessObjects.Entities.Notification;
using BusinessObjects.ViewModels.Notification;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notification.Data;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Notification.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public NotificationController(AppDBContext context, IMapper mapper)
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

        /*------------------------------------------------------------Notification------------------------------------------------------------*/

        [HttpGet("GetNotificationByUser/{idUser}")]
        public async Task<List<ViewNotification>> GetNotificationByUser(string idUser)
        {
            var notifications = await _context.Notifications.Where(x => x.idReceiver == idUser).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            var result = _mapper.Map<List<ViewNotification>>(notifications);
            foreach (var notification in result)
            {
                var infoUser = await GetNameUserCurrent(notification.idSender!);
                notification.nameSender = infoUser.fullName;
                notification.avatar = infoUser.avatar;
            }
            return result;
        }

        [HttpGet("GetNotificationById/{idNotification}")]
        /*public Task<Response> GetNotificationById(Guid idNotification)
        {

        }*/

        [HttpPost("CreateNotificationFollow/{idSender}/{idReceiver}")]
        public async Task<ViewNotification> CreateNotificationFollow(string idSender, string idReceiver)
        {
            Notificationn notification = new Notificationn()
            {
                idSender = idSender,
                idReceiver = idReceiver,
                content = "content_noti",
                isRead = false,
                url = "Follow",
                createdDate = DateTime.Now
            };
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewNotification>(notification);
            var infoUser = await GetNameUserCurrent(result.idSender!);
            result.nameSender = infoUser.fullName;
            result.avatar = infoUser.avatar;
            result.content = $"{notification.content}";
            return result;
        }

        [HttpPut("ReadNotification/{idNotification}")]
        public async Task<IActionResult> ReadNotification(Guid idNotification)
        {
            var notifi = await _context.Notifications.FirstOrDefaultAsync(x => x.idNotification == idNotification);
            if (notifi == null)
            {
                return NotFound();
            }
            notifi.isRead = true;
            await _context.SaveChangesAsync();
            return Ok(notifi);
        }

        [HttpPost("CreateNotificationComment/{idSender}/{idReceiver}/{idPost}")]
        public async Task<ViewNotification> CreateNotificationComment(string idSender, string idReceiver, Guid idPost)
        {
            Notificationn notification = new Notificationn()
            {
                idSender = idSender,
                idReceiver = idReceiver,
                content = "content_notipost",
                isRead = false,
                url = "PostComment",
                createdDate = DateTime.Now
            };
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewNotification>(notification);
            result.idPost = idPost;
            var infoUser = await GetNameUserCurrent(result.idSender!);
            result.nameSender = infoUser.fullName;
            result.avatar = infoUser.avatar;
            result.content = $"{notification.content}";
            return result;
        }
    }
}
