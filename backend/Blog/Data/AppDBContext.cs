using BusinessObjects.Entities.Blog;
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
        public DbSet<BlogCommentLike> BlogCommentLikes { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<BlogLike> BlogLikes { get; set; }
        public DbSet<BlogReplyLike> BlogReplyLikes { get; set; }
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
