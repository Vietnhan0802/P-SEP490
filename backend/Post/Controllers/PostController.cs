using AutoMapper;
using BusinessObjects.Entities.Post;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.PostComment;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Post.Data;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Post.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly HttpClient client;
        private readonly ILogger<PostController> _logger;

        public string UserApiUrl { get; private set; }

        public PostController(AppDBContext context, IMapper mapper, ILogger<PostController> logger)
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Posts>>> GetPosts()
        {
            return await _dbContext.Posts.ToListAsync();
        }

        [HttpPost("CreatePost")]
        public async Task<ActionResult<CreatePostViewModel>> CreatePost(CreatePostViewModel postViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var postEntity = new Posts
                    {
                        idPost = postViewModel.idPost,
                        Title = postViewModel.Title,
                        Content = postViewModel.Content,
                        Major = postViewModel.Major,
                        Exp = postViewModel.Exp,
                        View = postViewModel.View
                    };

                    _dbContext.Posts.Add(postEntity);
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

        [HttpPut("UpdatePost/{id}")]
        public async Task<ActionResult<UpdatePostViewModel>> UpdatePost(Guid id, [FromBody] UpdatePostViewModel updatedPostViewModel)
        {
            try
            {
                var existingPost = await _dbContext.Posts.FindAsync(id);

                if (existingPost == null)
                {
                    return NotFound("Post not found");
                }

                existingPost.Title = updatedPostViewModel.Title;
                existingPost.Content = updatedPostViewModel.Content;
                existingPost.Major = updatedPostViewModel.Major;
                existingPost.Exp = updatedPostViewModel.Exp;
                existingPost.View = updatedPostViewModel.View;

                _dbContext.Posts.Update(existingPost);
                await _dbContext.SaveChangesAsync();

                return Ok("Updated post successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("DeletePost/{id}")]
        public async Task<ActionResult> DeletePost(Guid id)
        {
            try
            {
                var postToDelete = await _dbContext.Posts.FindAsync(id);

                if (postToDelete == null)
                {
                    return NotFound("Post not found");
                }
                postToDelete.IsDeleted = true;
                await _dbContext.SaveChangesAsync();
                return Ok("Deleted post successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("SearchPostsByUserId/{userId}")]
        public ActionResult<IEnumerable<Posts>> SearchPostsByUserId(Guid userId)
        {
            try
            {
                var userPosts = _dbContext.Posts.Where(post => post.IdUser == userId).ToList();

                if (userPosts.Count == 0)
                {
                    return NotFound("No posts found for the specified user ID.");
                }

                return Ok(userPosts);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("SearchPostsByName/{name}")]
        public ActionResult<IEnumerable<Posts>> SearchPostsByName(string name)
        {
            try
            {
                var postsByName = _dbContext.Posts.Where(post => post.Title.Contains(name)).ToList();

                if (postsByName.Count == 0)
                {
                    return NotFound($"No posts found with the specified name: {name}.");
                }

                return Ok(postsByName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("GetPostDetails/{id}")]
        public ActionResult<Posts> GetPostDetails(Guid id)
        {
            try
            {
                var postDetails = _dbContext.Posts.Find(id);

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

        /*************************************************************/

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
