using AutoMapper;
using BusinessObjects.Entities.Post;
using BusinessObjects.ViewModels.BlogComments;
using BusinessObjects.ViewModels.PostComment;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Post.Data;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Post.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentPostController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly HttpClient client;
        private readonly ILogger<CommentPostController> _logger;

        public string UserApiUrl { get; private set; }

        public CommentPostController(AppDBContext context, IMapper mapper, ILogger<CommentPostController> logger)
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

        [HttpGet("GetAllCommentsByPostId/{postId}")]
        public async Task<ActionResult<IEnumerable<CommentPostViewModel>>> GetAllCommentsByPostId(Guid postId)
        {
            try
            {
                var post = await _dbContext.Posts
             .Include(b => b.PostComments)
             .Where(b => b.idPost == postId && !b.IsDeleted)
             .FirstOrDefaultAsync();

                if (post == null)
                {
                    return NotFound($"Không tìm thấy post có id {postId}.");
                }

                var comments = post.PostComments
                    .Where(c => !c.IsDeleted)
                    .Select(comment => _mapper.Map<CommentPostViewModel>(comment))
                    .ToList();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy idblog.");
                return StatusCode(500, "Lỗi máy chủ nội bộ");
            }
        }

        [HttpPost("CreateComment/{postId}")]
        public async Task<ActionResult<CommentPostViewModel>> CreateComment(Guid postId, CommentPostViewModel commentViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var post = await _dbContext.Posts
                        .Include(b => b.PostComments)
                        .FirstOrDefaultAsync(b => b.idPost == postId);

                    if (post == null)
                    {
                        return NotFound($"Không tìm thấy post có id {postId}.");
                    }

                    var commentEntity = new PostComment
                    {
                        idPost = postId,
                        Content = commentViewModel.Content,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now
                    };

                    post.PostComments.Add(commentEntity);

                    _dbContext.PostComments.Add(commentEntity);
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

        [HttpPut("UpdateComment/{idPostComment}")]
        public async Task<ActionResult> UpdateComment(Guid idPostComment, CommentPostViewModel updatedComment)
        {
            try
            {
                var existingComment = await _dbContext.PostComments.FindAsync(idPostComment);

                if (existingComment == null)
                {
                    return NotFound($"Comment with id {idPostComment} not found.");
                }

                existingComment.Content = updatedComment.Content;

                _dbContext.Entry(existingComment).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                return Ok($"Comment with id {idPostComment} updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("DeleteComment/{idPostComment}")]
        public async Task<ActionResult> DeleteComment(Guid idPostComment)
        {
            try
            {
                var commentToDelete = await _dbContext.PostComments.FirstOrDefaultAsync(c => c.idPostComment == idPostComment);

                if (commentToDelete == null)
                {
                    return NotFound($"Comment with id {idPostComment} not found.");
                }

                commentToDelete.IsDeleted = true;
                await _dbContext.SaveChangesAsync();
                return Ok($"Comment with id {idPostComment} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
