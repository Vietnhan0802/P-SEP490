using BusinessObjects.Entities.Projects;
using Microsoft.EntityFrameworkCore;

namespace Project.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) { }

        public DbSet<Position> Positions { get; set; }
        public DbSet<ProjectInfo> ProjectInfos { get; set; }
        public DbSet<ProjectMember> ProjectMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProjectMember>()
                .HasOne(p => p.ProjectInfo)
                .WithMany(p => p.ProjectMembers)
                .HasForeignKey(p => p.idProject);
            modelBuilder.Entity<Position>()
                .HasOne(p => p.ProjectInfo)
                .WithMany(p => p.Positions)
                .HasForeignKey(p => p.idProject);
            modelBuilder.Entity<ProjectMember>()
                .HasOne(p => p.Position)
                .WithMany()
                .HasForeignKey(p => p.idPosition);

            base.OnModelCreating(modelBuilder);
        }
    }
}
