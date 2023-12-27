﻿using BusinessObjects.Entities.Content;
using BusinessObjects.ViewModels.Post;
using Content.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Content.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public PostController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetVerifications()
        {
            return await _dbContext.Posts.ToListAsync();
        }

        [HttpPost("CreatePost")]
        public async Task<ActionResult<CreatePostViewModel>> CreateProduct(CreatePostViewModel postViewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var postEntity = new Post
                    {
                        idPost = postViewModel.idPost,
                        Title = postViewModel.Title,
                        Content = postViewModel.Content,
                        Image = postViewModel.Image,
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
                existingPost.Image = updatedPostViewModel.Image;
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

                _dbContext.Posts.Remove(postToDelete);
                await _dbContext.SaveChangesAsync();

                return Ok("Deleted post successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
