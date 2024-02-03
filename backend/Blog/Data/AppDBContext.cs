using BusinessObjects.Entities.Blog;
using Microsoft.EntityFrameworkCore;

namespace Blog.Data
{
    public class AppDBContext: DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Blogg> Blogs { get; set; }
        public DbSet<BloggImage> BlogImages { get; set; }
        public DbSet<BloggLike> BlogLikes { get; set; }
        public DbSet<BloggComment> BlogComments { get; set; }
        public DbSet<BloggCommentLike> BlogCommentLikes { get; set; }
        public DbSet<BloggReply> BlogReplies { get; set; }
        public DbSet<BloggReplyLike> BlogReplyLikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Blogg>()
                .HasMany(x => x.BloggLikes)
                .WithOne(x => x.Blogg)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<Blogg>()
                .HasMany(x => x.BloggImages)
                .WithOne(x => x.Blogg)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<Blogg>()
                .HasMany(x => x.BloggComments)
                .WithOne(x => x.Blogg)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<BloggComment>()
                .HasMany(x => x.BloggReplies)
                .WithOne(x => x.BloggComment)
                .HasForeignKey(x => x.idBlogComment);

            modelBuilder.Entity<BloggComment>()
                .HasMany(x => x.BloggCommentLikes)
                .WithOne(x => x.BloggComment)
                .HasForeignKey(x => x.idBlogComment);

            modelBuilder.Entity<BloggReply>()
                .HasMany(x => x.BloggReplyLikes)
                .WithOne(x => x.BloggReply)
                .HasForeignKey(x => x.idBlogReply);

            base.OnModelCreating(modelBuilder);
        }
    }
}
