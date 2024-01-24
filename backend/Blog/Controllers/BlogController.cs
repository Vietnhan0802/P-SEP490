using AutoMapper;
using Blog.Data;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Post;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.Json;
using BlogReply = BusinessObjects.Entities.Blog.BloggReply;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;

        public string UserApiUrl { get; private set; }

        public BlogController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /*[HttpGet("GetNameUserCurrent/{idUser}")]
        private async Task<string> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<string>(strData, option);

            return user;
        }*/

        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<Blogg>>> GetBlogs()
        {
            return await _dbContext.Blogs.ToListAsync();
        }

        [HttpPost("CreateBlog")]
        public Task<Response> CreateBlog()
        {

        }

        [HttpPost("CreateBlog/{idUser}")]
        public async Task<ActionResult<CreateBlogViewModel>> CreateBlog(CreateBlogViewModel blogViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var blogEntity = new Blogg
                    {
                        
                        Title = blogViewModel.Title,
                        Content = blogViewModel.Content,
                    };

                    _dbContext.Blogs.Add(blogEntity);
                    await _dbContext.SaveChangesAsync();

                    return Ok("Created a new product successfully.");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error");
                }
            }

            return BadRequest("Invalid input or validation failed.");
        }

        [HttpPut("UpdateBlog/{id}")]
        public async Task<ActionResult> UpdateBlog(Guid id, UpdateBlogViewModel updatedBlog)
        {
            try
            {
                var existingBlog = await _dbContext.Blogs.FindAsync(id);

                if (existingBlog == null)
                {
                    return NotFound($"Blog with id {id} not found.");
                }

                existingBlog.Title = updatedBlog.Title;
                existingBlog.Content = updatedBlog.Content;

                _dbContext.Entry(existingBlog).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                return Ok($"Blog with id {id} updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("DeleteBlog/{id}")]
        public async Task<ActionResult> DeleteBlog(Guid id)
        {
            try
            {
                var blogToDelete = await _dbContext.Blogs.FindAsync(id);

                if (blogToDelete == null)
                {
                    return NotFound($"Blog with id {id} not found.");
                }

                blogToDelete.IsDeleted = true;
                await _dbContext.SaveChangesAsync();
                return Ok($"Blog with id {id} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}/LikeCount")]
        public async Task<ActionResult<int>> GetLikeCount(Guid id)
        {
            try
            {
                var blog = await _dbContext.Blogs.FindAsync(id);

                if (blog == null)
                {
                    return NotFound($"Blog with id {id} not found.");
                }

                var likeCount = await _dbContext.BlogLikes
                    .CountAsync(like => like.idBlog == id && !like.IsDeleted);

                return Ok(likeCount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("{id}/Like")]
        public async Task<ActionResult> LikeBlog(Guid id)
        {
            try
            {
                var blog = await _dbContext.Blogs.FindAsync(id);

                if (blog == null)
                {
                    return NotFound($"Blog with id {id} not found.");
                }

                var existingLike = await _dbContext.BlogLikes
                    .FirstOrDefaultAsync(like => like.idBlog == id && !like.IsDeleted);

                if (existingLike != null)
                {
                    return BadRequest("User has already liked this blog.");
                }

                var newLike = new BloggLike
                {
                    idBlog = id
                };

                _dbContext.BlogLikes.Add(newLike);
                await _dbContext.SaveChangesAsync();

                return Ok($"Liked blog with id {id} successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }



        [HttpPut("{id}/Unlike")]
        public async Task<ActionResult> UnlikeBlog(Guid id)
        {
            try
            {
                var blog = await _dbContext.Blogs.FindAsync(id);

                if (blog == null)
                {
                    return NotFound($"Blog with id {id} not found.");
                }

               
                var existingLike = await _dbContext.BlogLikes
                    .FirstOrDefaultAsync(like => like.idBlog == id && !like.IsDeleted);

                if (existingLike == null)
                {
                    return BadRequest("User has not liked this blog.");
                }

                existingLike.IsDeleted = true;
                await _dbContext.SaveChangesAsync();

                return Ok($"Unliked blog with id {id} successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("SearchBlogByName")]
        public async Task<ActionResult<IEnumerable<Blogg>>> SearchBlogByName(string searchTerm)
        {
            try
            {
                var blogs = await _dbContext.Blogs
                    .Where(blog => blog.Title.Contains(searchTerm) && !blog.IsDeleted)
                    .ToListAsync();

                return Ok(blogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("GetBlogDetails/{id}")]
        public ActionResult<Blogg> GetPostDetails(Guid id)
        {
            try
            {
                var postDetails = _dbContext.Blogs.Find(id);

                if (postDetails == null)
                {
                    return NotFound("Post not found");
                }

                return Ok(postDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

*//*************************************************************************//*

        [HttpGet("GetAllCommentsByBlogId/{blogId}")]
        public async Task<ActionResult<IEnumerable<CreateCommentBlog>>> GetAllCommentsByBlogId(Guid blogId)
        {
            try
            {
                var blog = await _dbContext.Blogs
             .Include(b => b.BlogComments)
             .Where(b => b.idBlog == blogId && !b.IsDeleted)
             .FirstOrDefaultAsync();

                if (blog == null)
                {
                    return NotFound($"Không tìm thấy blog có id {blogId}.");
                }

                var comments = blog.BlogComments
                    .Where(c => !c.IsDeleted)
                    .Select(comment => _mapper.Map<CreateCommentBlog>(comment))
                    .ToList();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy idblog.");
                return StatusCode(500, "Lỗi máy chủ nội bộ");
            }
        }



        [HttpPost("CreateComment/{blogId}")]
        public async Task<ActionResult<CreateCommentBlog>> CreateComment(Guid blogId, CreateCommentBlog commentViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var blog = await _dbContext.Blogs
                        .Include(b => b.BlogComments)
                        .FirstOrDefaultAsync(b => b.idBlog == blogId);

                    if (blog == null)
                    {
                        return NotFound($"Không tìm thấy blog có id {blogId}.");
                    }

                    var commentEntity = new BloggComment
                    {
                        idBlog = blogId,
                        Content = commentViewModel.Content,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now
                    };

                    blog.BlogComments.Add(commentEntity);

                    _dbContext.BlogComments.Add(commentEntity);
                    await _dbContext.SaveChangesAsync();

                    return Ok("Created a new comment successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Lỗi khi tạo mới bình luận.");
                    return StatusCode(500, "Lỗi máy chủ nội bộ");
                }
            }

            return BadRequest("Dữ liệu không hợp lệ hoặc không thể xác minh.");
        }


        [HttpPut("UpdateComment/{idBlogComment}")]
        public async Task<ActionResult> UpdateComment(Guid idBlogComment, UpdateCommentBlog updatedComment)
        {
            try
            {
                var existingComment = await _dbContext.BlogComments.FindAsync(idBlogComment);

                if (existingComment == null)
                {
                    return NotFound($"Comment with id {idBlogComment} not found.");
                }

                existingComment.Content = updatedComment.Content;

                _dbContext.Entry(existingComment).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                return Ok($"Comment with id {idBlogComment} updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("DeleteComment/{idBlogComment}")]
        public async Task<ActionResult> DeleteComment(Guid idBlogComment)
        {
            try
            {
                var commentToDelete = await _dbContext.BlogComments.FirstOrDefaultAsync(c => c.idBlogComment == idBlogComment);

                if (commentToDelete == null)
                {
                    return NotFound($"Comment with id {idBlogComment} not found.");
                }

                commentToDelete.IsDeleted = true;
                await _dbContext.SaveChangesAsync();
                return Ok($"Comment with id {idBlogComment} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        //[HttpPost("LikeReplyComment/{idBlogReply}")]
        //public async Task<ActionResult> LikeReplyComment(Guid idBlogReply)
        //{
        //    try
        //    {
        //        var replyComment = await _dbContext.BlogComments.FindAsync(idBlogReply);

        //        if (replyComment == null)
        //        {
        //            return NotFound($"Reply comment with id {idBlogReply} not found.");
        //        }

        //        // Kiểm tra xem người dùng đã like reply comment chưa
        //        var existingLike = await _dbContext.BlogCommentLikes
        //            .FirstOrDefaultAsync(like => like.idBlogCommentLike == idBlogReply && !like.IsDeleted);

        //        if (existingLike != null)
        //        {
        //            return BadRequest("User has already liked this reply comment.");
        //        }

        //        var newLike = new BlogCommentLike
        //        {
        //            idBlogCommentLike = idBlogReply
        //        };

        //        _dbContext.BlogCommentLikes.Add(newLike);
        //        await _dbContext.SaveChangesAsync();

        //        return Ok($"Liked reply comment with id {idBlogReply} successfully.");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Internal server error while liking reply comment.");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}


        [HttpGet("GetAllComments")]
        public async Task<ActionResult<IEnumerable<CreateCommentBlog>>> GetAllComments()
        {
            try
            {
                var comments = await _dbContext.BlogComments
                    .Where(comment => !comment.IsDeleted)
                    .Select(comment => _mapper.Map<CreateCommentBlog>(comment))
                    .ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while retrieving all comments.");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPost("ReplyComment/{idBlogComment}")]
        public async Task<ActionResult<BlogReplyViewModel>> ReplyComment(Guid idBlogComment, BlogReplyViewModel replyViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var parentComment = await _dbContext.BlogComments.FindAsync(idBlogComment);

                    if (parentComment == null)
                    {
                        return NotFound($"Parent comment with id {idBlogComment} not found.");
                    }

                    var replyEntity = new BlogReply
                    {
                        Content = replyViewModel.Content,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now
                    };

                    _dbContext.BlogReplies.Add(replyEntity);
                    await _dbContext.SaveChangesAsync();

                    return Ok("Replied to the comment successfully.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while replying to the comment.");
                    return StatusCode(500, "Internal server error");
                }
            }

            return BadRequest("Invalid input or validation failed.");
        }*/


    }
}
