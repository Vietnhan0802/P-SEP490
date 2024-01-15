using BusinessObjects.Entities.Notification;
using Microsoft.EntityFrameworkCore;

namespace Communication.DBContext
{
    public class MyNotificationDbContext : DbContext
    {
        public DbSet<Notifications> Notifications { get; set; }

        public MyNotificationDbContext(DbContextOptions<MyNotificationDbContext> options) : base(options)
        {
        }
    }
}
