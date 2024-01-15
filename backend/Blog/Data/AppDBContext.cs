using BusinessObjects.Entities.Content;
using BusinessObjects.Entities.Projects;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Blog.Data
{
    public class AppDBContext: DbContext
    {
        public DbSet<Blogs> Blogs { get; set; }
        public DbSet<BlogReply> BlogReplies { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
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
