using BusinessObjects.Entities.Projects;
using Microsoft.EntityFrameworkCore;

namespace Project.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        public DbSet<ProjectInfo> ProjectInfos { get; set; }
        public DbSet<ProjectInvitation> ProjectInvitations { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProjectInvitation>()
                .HasOne(p => p.Project)
                .WithMany(p => p.ProjectInvitations)
                .HasForeignKey(p => p.idProject);

            modelBuilder.Entity<ProjectMember>()
                .HasOne(p => p.Project)
                .WithMany(p => p.ProjectMembers)
                .HasForeignKey(p => p.idProject);

            base.OnModelCreating(modelBuilder);
        }
    }
}
