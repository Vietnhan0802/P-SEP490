using BusinessObjects.Entities.Blogs;
using Microsoft.EntityFrameworkCore;

namespace BlogService.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogImage> BlogsImage { get; set; }
        public DbSet<BlogLike> BlogsLike { get; set; }
        public DbSet<BlogComment> BlogsComment { get; set; }
        public DbSet<BlogCommentLike> BlogsCommentLike { get; set; }
        public DbSet<BlogReply> BlogsReply { get; set; }
        public DbSet<BlogReplyLike> BlogsReplyLike { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Blog>()
                .HasMany(x => x.BlogLikes)
                .WithOne(x => x.Blog)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<Blog>()
                .HasMany(x => x.BlogImages)
                .WithOne(x => x.Blog)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<Blog>()
                .HasMany(x => x.BlogComments)
                .WithOne(x => x.Blog)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<BlogComment>()
                .HasMany(x => x.BlogReplies)
                .WithOne(x => x.BlogComment)
                .HasForeignKey(x => x.idBlogComment);

            modelBuilder.Entity<BlogComment>()
                .HasMany(x => x.BlogCommentLikes)
                .WithOne(x => x.BlogComment)
                .HasForeignKey(x => x.idBlogComment);

            modelBuilder.Entity<BlogReply>()
                .HasMany(x => x.BlogReplyLikes)
                .WithOne(x => x.BlogReply)
                .HasForeignKey(x => x.idBlogReply);

            base.OnModelCreating(modelBuilder);
        }
    }
}
