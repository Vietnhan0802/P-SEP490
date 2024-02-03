using AutoMapper;
using Blog.Data;
using Blog.Validator;
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
        private async Task<ViewUser> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<ViewUser>(strData, option);

            return user!;
        }

        /*------------------------------------------------------------Blog------------------------------------------------------------*/

        /*[HttpGet("SearchBlogs/{nameBlog}")]
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
                //blog.fullName = await GetNameUserCurrent(blog.idAccount!);
                foreach (var image in blog.ViewBlogImages!)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Search blogs success!", result);
        }*/

        [HttpGet("GetAllBlogs")]
        public async Task<Response> GetAllBlogs()
        {
            var blogs = await _context.Blogs.Where(x => x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs == null)
            {
                return new Response(HttpStatusCode.NoContent, "Blog list is empty!");
            }
            var result = _mapper.Map<List<ViewBlog>>(blogs);
            foreach (var blog in result)
            {
                blog.like = await _context.BlogLikes.Where(x => x.idBlog == blog.idBlog).CountAsync();
                var infoUser = await GetNameUserCurrent(blog.idAccount!);
                blog.fullName = infoUser.fullName;
                blog.avatar = infoUser.avatar;
                var blogImages = await _context.BlogImages.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                blog.ViewBlogImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get blog list is success!", result);
        }

        [HttpGet("GetBlogByUser/{idUser}")]
        public async Task<Response> GetBlogByUser(string idUser)
        {
            var blogs = await _context.Blogs.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs == null)
            {
                return new Response(HttpStatusCode.NoContent, "Blog list is empty!");
            }
            var result = _mapper.Map<List<ViewBlog>>(blogs);
            foreach (var blog in result)
            {
                blog.like = await _context.BlogLikes.Where(x => x.idBlog == blog.idBlog).CountAsync();
                var infoUser = await GetNameUserCurrent(blog.idAccount!);
                blog.fullName = infoUser.fullName;
                blog.avatar = infoUser.avatar;
                var blogImages = await _context.BlogImages.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                blog.ViewBlogImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get blog list is success!", result);
        }

        [HttpGet("GetBlogById/{idBlog}")]
        public async Task<Response> GetBlogById(Guid idBlog)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
            }
            var result = _mapper.Map<ViewBlog>(blog);
            result.like = await _context.BlogLikes.Where(x => x.idBlog == blog.idBlog).CountAsync();
            var infoUser = await GetNameUserCurrent(result.idAccount!);
            result.fullName = infoUser.fullName;
            result.avatar = infoUser.avatar;
            var blogImages = await _context.BlogImages.Where(x => x.idBlog == blog.idBlog).ToListAsync();
            var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
            foreach (var image in viewImages)
            {
                image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
            }
            result.ViewBlogImages = viewImages;
            blog.view++;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Get blog is success!", result);
        }

        [HttpPost("CreateBlog/{idUser}")]
        public async Task<Response> CreateBlog(string idUser, [FromForm] CreateUpdateBlog createUpdateBlog)
        {
            var validator = new CreateUpdateBlogValidator();
            var validatorResult = validator.Validate(createUpdateBlog);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var blog = _mapper.Map<Blogg>(createUpdateBlog);
            blog.idAccount = idUser;
            blog.isDeleted = false;
            blog.createdDate = DateTime.Now;
            await _context.Blogs.AddAsync(blog);
            if (createUpdateBlog.CreateUpdateBlogImages != null)
            {
                foreach (var image in createUpdateBlog.CreateUpdateBlogImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    BloggImage bloggImage = new BloggImage() 
                    {
                        idBlog = blog.idBlog,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.BlogImages.AddAsync(bloggImage);
                }
            }
            else 
            {
                blog.BloggImages = null;
            }
            await _context.SaveChangesAsync();
            var blogImages = await _context.BlogImages.Where(x => x.idBlog == blog.idBlog).ToListAsync();
            var viewBlog =  _mapper.Map<ViewBlog>(blog);
            var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
            viewBlog.ViewBlogImages = viewImages;
            return new Response(HttpStatusCode.OK, "Create blog is success!", viewBlog);
        }

        [HttpPut("UpdateBlog/{idBlog}")]
        public async Task<Response> UpdateBlog(Guid idBlog, [FromForm] CreateUpdateBlog createUpdateBlog)
        {
            var validator = new CreateUpdateBlogValidator();
            var validatorResult = validator.Validate(createUpdateBlog);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
            }
            _mapper.Map(createUpdateBlog, blog);
            var images = await _context.BlogImages.Where(x => x.idBlog == blog.idBlog).ToListAsync();
            foreach (var image in images)
            {
                _context.BlogImages.Remove(image);
                _saveImageService.DeleteImage(image.image!);
            }
            if (createUpdateBlog.CreateUpdateBlogImages != null)
            {
                foreach (var image in createUpdateBlog.CreateUpdateBlogImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    BloggImage bloggImage = new BloggImage()
                    {
                        idBlog = blog.idBlog,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.BlogImages.AddAsync(bloggImage);
                }
            }
            else
            {
                blog.BloggImages = null;
            }
            _context.Blogs.Update(blog);
            await _context.SaveChangesAsync();
            var blogImages = await _context.BlogImages.Where(x => x.idBlog == blog.idBlog).ToListAsync();
            var viewBlog = _mapper.Map<ViewBlog>(blog);
            viewBlog.ViewBlogImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
            return new Response(HttpStatusCode.BadRequest, "Update blog is success!", viewBlog);
        }

        [HttpDelete("RemoveBlog/{idBlog}")]
        public async Task<Response> RemoveBlog(Guid idBlog)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog == null)
            {
                return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
            }
            blog.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove blog is success!");
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

        //*------------------------------------------------------------BlogComment------------------------------------------------------------*//*

        [HttpGet("GetAllCommentByBlog/{idBlog}")]
        public async Task<Response> GetAllCommentByBlog(Guid idBlog)
        {
            var comments = await _context.BlogComments.Where(x => x.idBlog == idBlog && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (comments == null)
            {
                return new Response(HttpStatusCode.NoContent, "Comment list is empty!");
            }
            var resultComments = _mapper.Map<List<ViewBlogComment>>(comments);
            foreach (var comment in resultComments)
            {
                comment.like = await _context.BlogCommentLikes.Where(x => x.idBlogComment == comment.idBlogComment).CountAsync();
                var infoUserComment = await GetNameUserCurrent(comment.idAccount!);
                comment.fullName = infoUserComment.fullName;
                comment.avatar = infoUserComment.avatar;
                var replies = await _context.BlogReplies.Where(x => x.idBlogComment == comment.idBlogComment && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                var resultReplies = _mapper.Map<List<ViewBlogReply>>(replies);
                foreach (var reply in resultReplies)
                {
                    reply.like = await _context.BlogReplyLikes.Where(x => x.idBlogReply == reply.idBlogReply).CountAsync();
                    var infoUserReply = await GetNameUserCurrent(reply.idAccount!);
                    reply.fullName = infoUserReply.fullName;
                    reply.avatar = infoUserReply.avatar;
                }
                comment.ViewBlogReplies = resultReplies;
            }
            return new Response(HttpStatusCode.OK, "Get comment list is success!", resultComments);
        }

        [HttpPost("CreateBlogComment/{idUser}/{idBlog}")]
        public async Task<Response> CreateBlogComment(string idUser, Guid idBlog, CreateUpdateBlogComment createUpdateBlogComment)
        {
            var validator = new CreateUpdateBlogCommentValidator();
            var validatorResult = validator.Validate(createUpdateBlogComment);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
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
            return new Response(HttpStatusCode.OK, "Create comment is success!", _mapper.Map<ViewBlogComment>(blogComment));
        }

        [HttpPut("UpdateBlogComment/{idBlogComment}")]
        public async Task<Response> UpdateBlogComment(Guid idBlogComment, CreateUpdateBlogComment createUpdateBlogComment)
        {
            var validator = new CreateUpdateBlogCommentValidator();
            var validatorResult = validator.Validate(createUpdateBlogComment);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var blogComment = await _context.BlogComments.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Comment doesn't exist!");
            }
            _mapper.Map(createUpdateBlogComment, blogComment);
            _context.BlogComments.Update(blogComment);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update comment is success!", _mapper.Map<ViewBlogComment>(blogComment));
        }

        [HttpDelete("RemoveBlogComment/{idBlogComment}")]
        public async Task<Response> RemoveBlogComment(Guid idBlogComment)
        {
            var blogComment = await _context.BlogComments.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Comment doesn't exist!");
            }
            blogComment.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove comment is success!");
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
            return new Response(HttpStatusCode.NoContent, "Like or unlike comment is success!");
        }

        //*------------------------------------------------------------BlogReply------------------------------------------------------------*//*

        [HttpPost("CreateBlogReply/{idUser}/{idBlogComment}")]
        public async Task<Response> CreateBlogReply(string idUser, Guid idBlogComment, CreateUpdateBlogReply createUpdateBlogReply)
        {
            var validator = new CreateUpdateBlogReplyValidator();
            var validatorResult = validator.Validate(createUpdateBlogReply);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var blogComment = await _context.BlogComments.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Comment doesn't exist!");
            }
            var blogReply = _mapper.Map<BloggReply>(createUpdateBlogReply);
            blogReply.idAccount = idUser;
            blogReply.idBlogComment = idBlogComment;
            blogReply.isDeleted = false;
            blogReply.createdDate = DateTime.Now;
            await _context.BlogReplies.AddAsync(blogReply);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create reply is success!", _mapper.Map<ViewBlogReply>(blogReply));
        }

        [HttpPut("UpdateBlogReply/{idBlogReply}")]
        public async Task<Response> UpdateBlogReply(Guid idBlogReply, CreateUpdateBlogReply createUpdateBlogReply)
        {
            var validator = new CreateUpdateBlogReplyValidator();
            var validatorResult = validator.Validate(createUpdateBlogReply);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var blogReply = await _context.BlogReplies.FirstOrDefaultAsync(x => x.idBlogReply == idBlogReply);
            if (blogReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Reply doesn't exist!");
            }
            _mapper.Map(createUpdateBlogReply, blogReply);
            _context.BlogReplies.Update(blogReply);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update reply is success!", _mapper.Map<ViewBlogReply>(blogReply));
        }

        [HttpDelete("RemoveBlogReply/{idBlogReply}")]
        public async Task<Response> RemoveBlogReply(Guid idBlogReply)
        {
            var blogReply = await _context.BlogReplies.FirstOrDefaultAsync(x => x.idBlogReply == idBlogReply);
            if (blogReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Reply doesn't exist!");
            }
            blogReply.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove reply is success!");
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
