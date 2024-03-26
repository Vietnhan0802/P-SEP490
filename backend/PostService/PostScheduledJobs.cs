using PostService.Data;

namespace PostService
{
    public class PostScheduledJobs
    {
        private readonly AppDBContext _context;

        public PostScheduledJobs(AppDBContext context)
        {
            _context = context;
        }

        public void ResetViewInDateDaily()
        {
            var posts = _context.Posts.ToList();
            foreach (var post in posts)
            {
                post.viewInDate = 0;
            }
            _context.SaveChanges();
        }
    }
}
