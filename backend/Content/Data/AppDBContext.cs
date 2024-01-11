using BusinessObjects.Entities.Content;
using BusinessObjects.Entities.Projects;
using Microsoft.EntityFrameworkCore;

namespace Content.Data
{
    public class AppDBContext : DbContext
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogReply> BlogReplies { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<PostComment> PostComments { get; set; }   
        public DbSet<PostReply> PostReplies { get; set; }   
        public DbSet<ProjectInfo> Projects { get; set; }   
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
