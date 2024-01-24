using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Projects;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Blog.Data
{
    public class AppDBContext: DbContext
    {
        public DbSet<Blogg> Blogs { get; set; }
        public DbSet<BloggReply> BlogReplies { get; set; }
        public DbSet<BloggComment> BlogComments { get; set; }
        public DbSet<BloggCommentLike> BlogCommentLikes { get; set; }
        public DbSet<BloggImage> BlogImages { get; set; }
        public DbSet<BloggLike> BlogLikes { get; set; }
        public DbSet<BloggReplyLike> BlogReplyLikes { get; set; }
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
