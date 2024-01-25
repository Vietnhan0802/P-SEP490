using AutoMapper;
using Blog.Data;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Credential;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string UserApiUrl { get; private set; }

        public BlogController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
        {
            _context = context;
            _mapper = mapper;
            _saveImageService = saveImageService;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpGet("GetNameUserCurrent/{idUser}")]
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
        }
        /*-------------------------------------------Blog-------------------------------------------*/
        [HttpGet("SearchBlogs/{nameBlog}")]
        public async Task<Response> SearchBlogs(string nameBlog)
        {
            var blogs = await _context.Blogs.Include(x => x.BloggImages).Where(x => x.title!.Contains(nameBlog)).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs == null)
            {
                return new Response(HttpStatusCode.NoContent, "No blogs found with the given name!");
            }
            var result = _mapper.Map<List<ViewBlog>>(blogs);
            foreach (var blog in result)
            {
                blog.fullName = await GetNameUserCurrent(blog.idAccount!);
                foreach (var image in blog.BloggImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Search blogs success!", result);
        }

        [HttpGet("GetAllBlogs")]
        public async Task<Response> GetAllBlogs()
        {
            var blogs = await _context.Blogs.Include(x => x.BloggImages).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs == null)
            {
                return new Response(HttpStatusCode.NoContent, "List blogs doesn't empty!");
            }
            var result = _mapper.Map<List<ViewBlog>>(blogs);
            foreach (var blog in result)
            {
                blog.fullName = await GetNameUserCurrent(blog.idAccount!);
                foreach (var image in blog.BloggImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Get list blogs success!", result);
        }

        [HttpGet("GetBlogByUser/{idUser}")]
        public async Task<Response> GetBlogByUser(string idUser)
        {
            var blogs = await _context.Blogs.Include(x => x.BloggImages).Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs == null)
            {
                return new Response(HttpStatusCode.NoContent, "List blogs doesn't empty!");
            }
            var result = _mapper.Map<List<ViewBlog>>(blogs);
            foreach (var blog in result)
            {
                blog.fullName = await GetNameUserCurrent(blog.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Get list blogs success!", result);
        }

        [HttpGet("GetBlogById/{idBlog}")]
        public async Task<Response> GetBlogById(Guid idBlog)
        {
            var blog = await _context.Blogs.Include(x => x.BloggImages).FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exists!");
            }
            blog.view++;
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewBlog>(blog);
            result.fullName = await GetNameUserCurrent(result.idAccount!);
            return new Response(HttpStatusCode.OK, "Get list blog success!", result);
        }

        [HttpPost("CreateBlog")]
        public async Task<Response> CreateBlog(string idUser, CreateBlog createBlog)
        {
            var blog = _mapper.Map<Blogg>(createBlog);
            if (createBlog.CreateImages != null)
            {
                foreach (var image in createBlog.CreateImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    blog.BloggImages.Add(new BloggImage { image = imageName });
                }
                blog.idAccount = idUser;
                blog.isDeleted = false;
                blog.createdDate = DateTime.Now;
                await _context.Blogs.AddAsync(blog);
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Create blog is success!", _mapper.Map<ViewBlog>(blog));
            }
            return new Response(HttpStatusCode.OK, "Create blog is fail!");
        }

        [HttpPut("UpdateBlog/{idBlog}")]
        public async Task<Response> UpdateBlog(Guid idBlog, UpdateBlog updateBlog)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exists!");
            }
            if (updateBlog.UpdateImages != null)
            {
                foreach (var imageOld in blog.BloggImages)
                {
                    _saveImageService.DeleteImage(imageOld.image);
                }
                var result = _mapper.Map(updateBlog, blog);
                foreach (var imageNew in result.BloggImages)
                {
                    imageNew.image = await _saveImageService.SaveImage(imageNew.ImageFile);
                    result.BloggImages.Add(imageNew);
                }
                _context.Blogs.Update(result);
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Update blog is success!", _mapper.Map<UpdateBlog>(result));
            }
            return new Response(HttpStatusCode.OK, "Update blog is fail!");
        }

        [HttpDelete("RemoveBlog/{idBlog}")]
        public async Task<Response> RemoveBlog(Guid idBlog)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exists!");
            }
            blog.isDeleted = true;
            _context.Blogs.Update(blog);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove Blog success!");
        }

        [HttpGet("GetTotalLikeBlogs/{idBlog}")]
        public async Task<Response> GetTotalLikeBlogs(Guid idBlog)
        {
            var totalLikeBlogs = await _context.BlogLikes.Where(x => x.idBlog == idBlog).CountAsync();
            return new Response(HttpStatusCode.OK, "Get all like blog is success!", totalLikeBlogs);
        }

        [HttpPost("LikeOrUnlikeBlog/{idUser}/{idBlog}")]
        public async Task<Response> LikeOrUnlikeBlog(string idUser, Guid idBlog)
        {
            var existLike = await _context.BlogLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == idBlog);
            if (existLike == null)
            {
                var like = new BloggLike
                {
                    idAccount = idUser,
                    idBlog = idBlog,
                    createdDate = DateTime.Now
                };
                await _context.BlogLikes.AddAsync(like);
            }
            else
            {
                _context.BlogLikes.Remove(existLike);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Like or unlike blog is success!");
        }
        /*-------------------------------------------BlogComment-------------------------------------------*/
        [HttpPost("CreateCommentBlog")]
        public async Task<Response> CreateCommentBlog(string idUser, Guid idBlog, CreateBlogComment createBlogComment)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
            }
            var commentBlog = _mapper.Map<BloggComment>(createBlogComment);
            commentBlog.idAccount = idUser;
            commentBlog.idBlog = idBlog;
            commentBlog.isDeleted = false;
            commentBlog.createdDate = DateTime.Now;
            await _context.BlogComments.AddAsync(commentBlog);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create comment blog is success!", commentBlog);
        }
        /*

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
