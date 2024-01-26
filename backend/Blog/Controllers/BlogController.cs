using AutoMapper;
using Blog.Data;
using BusinessObjects.Entities.Blog;
using BusinessObjects.ViewModels.Blog;
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

        public string UserApiUrl { get; }

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

            return user!;
        }

        /*------------------------------------------------------------Blog------------------------------------------------------------*/

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
                return new Response(HttpStatusCode.NoContent, "Blogs doesn't empty!");
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
            return new Response(HttpStatusCode.OK, "Getall blogs is success!", result);
        }

        [HttpGet("GetBlogByUser/{idUser}")]
        public async Task<Response> GetBlogByUser(string idUser)
        {
            var blogs = await _context.Blogs.Include(x => x.BloggImages).Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs == null)
            {
                return new Response(HttpStatusCode.NoContent, "Blogs doesn't empty!");
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
            return new Response(HttpStatusCode.OK, "Getall blogs is success!", result);
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
            foreach (var image in result.BloggImages)
            {
                image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
            }
            return new Response(HttpStatusCode.OK, "Get blog is success!", result);
        }

        [HttpPost("CreateBlog")]
        public async Task<Response> CreateBlog(string idUser, CreateUpdateBlog createUpdateBlog)
        {
            var blog = _mapper.Map<Blogg>(createUpdateBlog);
            if (createUpdateBlog.CreateUpdateImageBlogs != null)
            {
                foreach (var image in createUpdateBlog.CreateUpdateImageBlogs)
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
            return new Response(HttpStatusCode.BadRequest, "Create blog is fail!");
        }

        [HttpPut("UpdateBlog/{idBlog}")]
        public async Task<Response> UpdateBlog(Guid idBlog, CreateUpdateBlog createUpdateBlog)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exists!");
            }
            if (createUpdateBlog.CreateUpdateImageBlogs != null)
            {
                foreach (var imageOld in blog.BloggImages)
                {
                    _saveImageService.DeleteImage(imageOld.image);
                }
                var result = _mapper.Map(createUpdateBlog, blog);
                foreach (var imageNew in result.BloggImages)
                {
                    imageNew.image = await _saveImageService.SaveImage(imageNew.ImageFile);
                    result.BloggImages.Add(imageNew);
                }
                _context.Blogs.Update(result);
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Update blog is success!", _mapper.Map<ViewBlog>(result));
            }
            return new Response(HttpStatusCode.BadRequest, "Update blog is fail!");
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
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove blog is success!");
        }

        [HttpGet("GetTotalLikeBlogs/{idBlog}")]
        public async Task<Response> GetTotalLikeBlogs(Guid idBlog)
        {
            var totalLikeBlogs = await _context.BlogLikes.Where(x => x.idBlog == idBlog).CountAsync();
            return new Response(HttpStatusCode.OK, "Getall like blogs is success!", totalLikeBlogs);
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

        /*------------------------------------------------------------BlogComment------------------------------------------------------------*/

        [HttpGet("GetAllBlogComments/{idBlog}")]
        public async Task<Response> GetAllBlogComments(Guid idBlog)
        {
            var comments = await _context.BlogComments.Where(x => x.idBlog == idBlog).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (comments == null)
            {
                return new Response(HttpStatusCode.NoContent, "Comments doesn't empty!");
            }
            var result = _mapper.Map<List<ViewBlogComment>>(comments);
            foreach (var comment in result)
            {
                comment.fullName = await GetNameUserCurrent(comment.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Getall comments is success!", result);
        }

        [HttpPost("CreateBlogComment/{idUser}/{idBlog}")]
        public async Task<Response> CreateBlogComment(string idUser, Guid idBlog, CreateUpdateBlogComment createUpdateBlogComment)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
            }
            var blogComment = _mapper.Map<BloggComment>(createUpdateBlogComment);
            blogComment.idAccount = idUser;
            blogComment.idBlog = idBlog;
            blogComment.isDeleted = false;
            blogComment.createdDate = DateTime.Now;
            await _context.BlogComments.AddAsync(blogComment);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create blog comment is success!", _mapper.Map<ViewBlogComment>(blogComment));
        }

        [HttpPut("UpdateBlogComment/{idBlogComment}")]
        public async Task<Response> UpdateBlogComment(Guid idBlogComment, CreateUpdateBlogComment createUpdateBlogComment)
        {
            var blogComment = await _context.BlogComments.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog comment doesn't exist!");
            }
            _mapper.Map(createUpdateBlogComment, blogComment);
            _context.BlogComments.Update(blogComment);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update blog comment is success!", _mapper.Map<ViewBlogComment>(blogComment));
        }

        [HttpDelete("RemoveBlogComment/{idBlogComment}")]
        public async Task<Response> RemoveBlogComment(Guid idBlogComment)
        {
            var blogComment = await _context.BlogComments.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog comment doesn't exist!");
            }
            blogComment.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove blog comment is success!");
        }

        [HttpGet("GetTotalLikeBlogComments/{idBlogComment}")]
        public async Task<Response> GetTotalLikeBlogComments(Guid idBlogComment)
        {
            var totalLikeBlogComments = await _context.BlogCommentLikes.Where(x => x.idBlogComment == idBlogComment).CountAsync();
            return new Response(HttpStatusCode.OK, "Getall like blog comments is success!", totalLikeBlogComments);
        }

        [HttpPost("LikeOrUnlikeBlogComment/{idUser}/{idBlogComment}")]
        public async Task<Response> LikeOrUnlikeBlogComment(string idUser, Guid idBlogComment)
        {
            var existLike = await _context.BlogCommentLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlogComment == idBlogComment);
            if (existLike == null)
            {
                var like = new BloggCommentLike
                {
                    idAccount = idUser,
                    idBlogComment = idBlogComment,
                    createdDate = DateTime.Now
                };
                await _context.BlogCommentLikes.AddAsync(like);
            }
            else
            {
                _context.BlogCommentLikes.Remove(existLike);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Like or unlike blog comment is success!");
        }

        /*------------------------------------------------------------BlogReply------------------------------------------------------------*/

        [HttpGet("GetAllBlogReplies/{idBlogComment}")]
        public async Task<Response> GetAllBlogReplies(Guid idBlogComment)
        {
            var replies = await _context.BlogReplies.Where(x => x.idBlogComment == idBlogComment).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (replies == null)
            {
                return new Response(HttpStatusCode.NoContent, "Replies doesn't empty!");
            }
            var result = _mapper.Map<List<ViewBlogReply>>(replies);
            foreach (var reply in result)
            {
                reply.fullName = await GetNameUserCurrent(reply.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Getall replies is success!", result);
        }

        [HttpPost("CreateBlogReply/{idUser}/{idBlogComment}")]
        public async Task<Response> CreateBlogReply(string idUser, Guid idBlogComment, CreateUpdateBlogReply createUpdateBlogReply)
        {
            var blogComment = await _context.BlogComments.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog comment doesn't exist!");
            }
            var blogReply = _mapper.Map<BloggReply>(createUpdateBlogReply);
            blogReply.idAccount = idUser;
            blogReply.idBlogComment = idBlogComment;
            blogReply.isDeleted = false;
            blogReply.createdDate = DateTime.Now;
            await _context.BlogReplies.AddAsync(blogReply);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create blog reply is success!", _mapper.Map<ViewBlogReply>(blogReply));
        }

        [HttpPut("UpdateBlogReply/{idBlogReply}")]
        public async Task<Response> UpdateBlogReply(Guid idBlogReply, CreateUpdateBlogReply createUpdateBlogReply)
        {
            var blogReply = await _context.BlogReplies.FirstOrDefaultAsync(x => x.idBlogReply == idBlogReply);
            if (blogReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog reply doesn't exist!");
            }
            _mapper.Map(createUpdateBlogReply, blogReply);
            _context.BlogReplies.Update(blogReply);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update blog reply is success!", _mapper.Map<ViewBlogReply>(blogReply));
        }

        [HttpDelete("RemoveBlogReply/{idBlogReply}")]
        public async Task<Response> RemoveBlogReply(Guid idBlogReply)
        {
            var blogReply = await _context.BlogReplies.FirstOrDefaultAsync(x => x.idBlogReply == idBlogReply);
            if (blogReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog reply doesn't exist!");
            }
            blogReply.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove blog reply is success!");
        }

        [HttpGet("GetTotalLikeBlogReplies/{idBlogReply}")]
        public async Task<Response> GetTotalLikeBlogReplies(Guid idBlogReply)
        {
            var totalLikeBlogReplies = await _context.BlogReplyLikes.Where(x => x.idBlogReply == idBlogReply).CountAsync();
            return new Response(HttpStatusCode.OK, "Getall like blog replies is success!", totalLikeBlogReplies);
        }

        [HttpPost("LikeOrUnlikeBlogReply/{idUser}/{idBlogReply}")]
        public async Task<Response> LikeOrUnlikeBlogReply(string idUser, Guid idBlogReply)
        {
            var existLike = await _context.BlogReplyLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlogReply == idBlogReply);
            if (existLike == null)
            {
                var like = new BloggReplyLike
                {
                    idAccount = idUser,
                    idBlogReply = idBlogReply,
                    createdDate = DateTime.Now
                };
                await _context.BlogReplyLikes.AddAsync(like);
            }
            else
            {
                _context.BlogReplyLikes.Remove(existLike);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Like or unlike blog reply is success!");
        }
    }
}
