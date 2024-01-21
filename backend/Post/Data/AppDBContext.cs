using BusinessObjects.Entities.Post;
using BusinessObjects.Entities.Projects;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Post.Data
{
    public class AppDBContext: DbContext
    {
        public DbSet<Posts> Posts { get; set; }
        public DbSet<PostReplyLike> PostReplyLikes { get; set; }
        public DbSet<PostLikes> PostLikes { get; set; }
        public DbSet<PostImage> PostImages { get; set; }
        public DbSet<PostCommentLike> PostCommentLikes { get; set; }
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
