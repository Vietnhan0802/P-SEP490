using BusinessObjects.Entities.Notification;
using Communication.DBContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Communication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationssController : ControllerBase
    {
        private readonly MyNotificationDbContext _context;

        public NotificationssController(MyNotificationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notifications>>> GetNotificationss()
        {
            return await _context.Notifications.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Notifications>> GetNotifications(Guid id)
        {
            var Notifications = await _context.Notifications.FindAsync(id);

            if (Notifications == null)
            {
                return NotFound();
            }

            return Notifications;
        }

        [HttpPost]
        public async Task<ActionResult<Notifications>> CreateNotifications(Notifications Notifications)
        {
            Notifications.IdNotification = Guid.NewGuid();
            Notifications.CreatedDate = DateTime.Now;
            Notifications.IsRead = false;
            _context.Notifications.Add(Notifications);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotifications", new { id = Notifications.IdNotification }, Notifications);
        }

        [HttpPut("{id}/mark-as-read")]
        public async Task<IActionResult> MarkNotificationsAsRead(Guid id)
        {
            var Notifications = await _context.Notifications.FindAsync(id);

            if (Notifications == null)
            {
                return NotFound();
            }

            Notifications.IsRead = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/mark-as-unread")]
        public async Task<IActionResult> MarkNotificationsAsUnread(Guid id)
        {
            var Notifications = await _context.Notifications.FindAsync(id);

            if (Notifications == null)
            {
                return NotFound();
            }

            Notifications.IsRead = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("sort/seen")]
        public async Task<ActionResult<IEnumerable<Notifications>>> SortSeenNotificationss()
        {
            return await _context.Notifications.Where(n => n.IsRead).ToListAsync();
        }

        [HttpGet("sort/unseen")]
        public async Task<ActionResult<IEnumerable<Notifications>>> SortUnseenNotificationss()
        {
            return await _context.Notifications.Where(n => !n.IsRead).ToListAsync();
        }
    }
}
