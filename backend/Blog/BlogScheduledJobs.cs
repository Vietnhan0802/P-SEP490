using Blog.Data;

namespace Blog
{
    public class BlogScheduledJobs
    {
        private readonly AppDBContext _context;

        public BlogScheduledJobs(AppDBContext context)
        {
            _context = context;
        }

        public void ResetViewInDateDaily()
        {
            var blogs = _context.Blogs.ToList();
            foreach (var blog in blogs)
            {
                blog.viewInDate = 0;
            }
            _context.SaveChanges();
        }
    }
}
