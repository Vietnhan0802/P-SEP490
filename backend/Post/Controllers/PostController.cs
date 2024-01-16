using AutoMapper;
using BusinessObjects.Entities.Post;
using BusinessObjects.ViewModels.Post;
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
        public string UserApiUrl { get; }

        public PostController(AppDBContext context, IMapper mapper)
        {
            _dbContext = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [NonAction]
        [HttpGet("GetCurrentUserByName")]
        private async Task<ViewUser> GetCurrentUserByName(string userId)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetUserById/{userId}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<ViewUser>(strData, option);

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


    }
}
