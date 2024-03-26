using BusinessObjects.Entities.Posts;
using Microsoft.EntityFrameworkCore;

namespace PostService.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<PostImage> PostImages { get; set; }
        public DbSet<PostComment> PostComments { get; set; }
        public DbSet<PostCommentLike> PostCommentLikes { get; set; }
        public DbSet<PostReply> PostReplys { get; set; }
        public DbSet<PostReplyLike> PostReplyLikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>()
                .HasMany(x => x.PostLikes)
                .WithOne(x => x.Post)
                .HasForeignKey(x => x.idPost);

            modelBuilder.Entity<Post>()
                .HasMany(x => x.PostImages)
                .WithOne(x => x.Post)
                .HasForeignKey(x => x.idPost);

            modelBuilder.Entity<Post>()
                .HasMany(x => x.PostComments)
                .WithOne(x => x.Post)
                .HasForeignKey(x => x.idPost);

            modelBuilder.Entity<PostComment>()
                .HasMany(x => x.PostReplies)
                .WithOne(x => x.PostComment)
                .HasForeignKey(x => x.idPostComment);

            modelBuilder.Entity<PostComment>()
                .HasMany(x => x.PostCommentLikes)
                .WithOne(x => x.PostComment)
                .HasForeignKey(x => x.idPostComment);

            modelBuilder.Entity<PostReply>()
                .HasMany(x => x.PostReplyLikes)
                .WithOne(x => x.PostReply)
                .HasForeignKey(x => x.idPostReply);

            base.OnModelCreating(modelBuilder);
        }
    }
}
