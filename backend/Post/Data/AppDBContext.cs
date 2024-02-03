using BusinessObjects.Entities.Post;
using Microsoft.EntityFrameworkCore;

namespace Post.Data
{
    public class AppDBContext: DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Postt> Postts { get; set; }
        public DbSet<PosttLike> PosttLikes { get; set; }
        public DbSet<PosttImage> PosttImages { get; set; }
        public DbSet<PosttComment> PosttComments { get; set; }
        public DbSet<PosttCommentLike> PosttCommentLikes { get; set; }
        public DbSet<PosttReply> PosttReplies { get; set; }
        public DbSet<PosttReplyLike> PosttReplyLikes { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Postt>()
                .HasMany(x => x.PosttLikes)
                .WithOne(x => x.Postt)
                .HasForeignKey(x => x.idPost);

            modelBuilder.Entity<Postt>()
                .HasMany(x => x.PosttImages)
                .WithOne(x => x.Postt)
                .HasForeignKey(x => x.idPost);

            modelBuilder.Entity<Postt>()
                .HasMany(x => x.PosttComments)
                .WithOne(x => x.Postt)
                .HasForeignKey(x => x.idPost);

            modelBuilder.Entity<PosttComment>()
                .HasMany(x => x.PosttReplies)
                .WithOne(x => x.PosttComment)
                .HasForeignKey(x => x.idPostComment);

            modelBuilder.Entity<PosttComment>()
                .HasMany(x => x.PosttCommentLikes)
                .WithOne(x => x.PosttComment)
                .HasForeignKey(x => x.idPostComment);

            modelBuilder.Entity<PosttReply>()
                .HasMany(x => x.PosttReplyLikes)
                .WithOne(x => x.PosttReply)
                .HasForeignKey(x => x.idPostReply);

            base.OnModelCreating(modelBuilder);
        }
    }
}
