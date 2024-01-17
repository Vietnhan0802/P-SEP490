using AutoMapper;
using Blog.Data;
using BusinessObjects.Entities.Blog;
using BusinessObjects.ViewModels.BlogComments;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly HttpClient client;
        private readonly ILogger<CommentController> _logger;

        public string UserApiUrl { get; private set; }

        public CommentController(AppDBContext context, IMapper mapper, ILogger<CommentController> logger)
        {
            _dbContext = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
            _logger = logger;
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

                    var commentEntity = new BlogComment
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
    }
}
