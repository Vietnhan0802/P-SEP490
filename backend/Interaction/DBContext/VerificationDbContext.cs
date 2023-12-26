using BusinessObjects.Entities.Interaction;
using Microsoft.EntityFrameworkCore;

namespace Interaction.DBContext
{
    public class VerificationDbContext : DbContext
    {
        public DbSet<Verification> Verifications { get; set; }

        public VerificationDbContext(DbContextOptions<VerificationDbContext> options) : base(options)
        {
        }
        public DbSet<Verification> verifications { get; set; }
    }
}
