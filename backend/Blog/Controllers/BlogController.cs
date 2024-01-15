using AutoMapper;
using Blog.Data;
using BusinessObjects.Entities.Blog;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Blog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly HttpClient client;
        public string UserApiUrl { get; }

        public BlogController(AppDBContext context, IMapper mapper)
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
        public async Task<ActionResult<IEnumerable<Blogs>>> GetBlogs()
        {
            return await _dbContext.Blogs.ToListAsync();
        }

        [HttpPost("CreateBlog")]
        public async Task<ActionResult<CreateBlogViewModel>> CreateBlog(CreateBlogViewModel blogViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var blogEntity = new Blogs
                    {
                        idBlog = blogViewModel.idBlog,
                        Title = blogViewModel.Title,
                        Content = blogViewModel.Content,
                        View = blogViewModel.View
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
                existingBlog.View = updatedBlog.View;

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

    }
}
