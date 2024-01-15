using BusinessObjects.Entities.Content;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Post;
using Content.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Content.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public BlogController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
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
                    var blogEntity = new Blog
                    {
                        idBlog = blogViewModel.idBlog,
                        Title = blogViewModel.Title,
                        Content = blogViewModel.Content,
                        Image = blogViewModel.Image,
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
        public async Task<ActionResult> UpdateBlog(int id, UpdateBlogViewModel updatedBlog)
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
                existingBlog.Image = updatedBlog.Image;
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
        public async Task<ActionResult> DeleteBlog(int id)
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
