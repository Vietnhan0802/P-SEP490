using BusinessObjects.Entities.Interaction;
using Microsoft.EntityFrameworkCore;

namespace Interaction.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Verification> Verifications { get; set; }
        public DbSet<AccountReport> AccountReports { get; set; }
        public DbSet<PostReport> PostReports { get; set; }
        public DbSet<BlogReport> BlogReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
