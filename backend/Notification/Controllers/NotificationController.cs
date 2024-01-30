using AutoMapper;
using BusinessObjects.Entities.Notification;
using BusinessObjects.ViewModels.Notification;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private async Task<string> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<string>(strData, option);

            return user!;
        }

        /*------------------------------------------------------------Notification------------------------------------------------------------*/

        [HttpPost("CreateNotificationFollow")]
        public async Task<Response> CreateNotificationFollow(string idSender, string idReceiver)
        {
            Notificationn notification = new Notificationn()
            {
                idSender = idSender,
                idReceiver = idReceiver,
                content = "has just started following you.",
                isRead = false,
                url = idSender
            };
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewNotification>(notification);
            result.nameSender = await GetNameUserCurrent(idSender);
            result.nameReceiver = await GetNameUserCurrent(idReceiver);
            result.content = $"{result.nameSender} {notification.content}";
            return new Response(HttpStatusCode.OK, "Create notification is success!", result);
        }
    }
}
