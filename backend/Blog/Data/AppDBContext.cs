using Microsoft.EntityFrameworkCore;

namespace Blog.Data
{
    public class AppDBContext: DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }

        /*public DbSet<> Blogs { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<BlogLike> BlogLikes { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<BlogCommentLike> BlogCommentLikes { get; set; }
        public DbSet<BlogReply> BlogReplies { get; set; }
        public DbSet<BlogReplyLike> BlogReplyLikes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Blog>()
                .HasMany(x => x.BloggLikes)
                .WithOne(x => x.Blogg)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<Blog>()
                .HasMany(x => x.BloggImages)
                .WithOne(x => x.Blogg)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<Blog>()
                .HasMany(x => x.BloggComments)
                .WithOne(x => x.Blogg)
                .HasForeignKey(x => x.idBlog);

            modelBuilder.Entity<BlogComment>()
                .HasMany(x => x.BloggReplies)
                .WithOne(x => x.BloggComment)
                .HasForeignKey(x => x.idBlogComment);

            modelBuilder.Entity<BlogComment>()
                .HasMany(x => x.BloggCommentLikes)
                .WithOne(x => x.BloggComment)
                .HasForeignKey(x => x.idBlogComment);

            modelBuilder.Entity<BlogReply>()
                .HasMany(x => x.BloggReplyLikes)
                .WithOne(x => x.BloggReply)
                .HasForeignKey(x => x.idBlogReply);

            base.OnModelCreating(modelBuilder);
        }*/
    }
}
