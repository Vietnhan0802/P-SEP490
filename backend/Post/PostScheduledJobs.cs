using Post.Data;

namespace Post
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
            var posts = _context.Postts.ToList();
            foreach (var post in posts)
            {
                post.viewHistory = post.viewInDate;
                post.viewInDate = 0;
            }
            _context.SaveChanges();
        }
    }
}
