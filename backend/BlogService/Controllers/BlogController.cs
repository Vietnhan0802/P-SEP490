using AutoMapper;
using BlogService.Data;
using BusinessObjects.Entities.Blogs;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace BlogService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string NotifyApiUrl { get; }
        public string UserApiUrl { get; }

        public BlogController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
        {
            _context = context;
            _mapper = mapper;
            _saveImageService = saveImageService;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            NotifyApiUrl = "https://localhost:7009/api/Notification";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        /*------------------------------------------------------------CallAPI------------------------------------------------------------*/

        [HttpPost("CreateNotificationBlogLike/{idSender}/{idReceiver}/{idBlog}")]
        private async Task<IActionResult> CreateNotificationBlogLike(string idSender, string idReceiver, Guid idBlog)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationBlogLike/{idSender}/{idReceiver}/{idBlog}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
        }

        [HttpPost("CreateNotificationBlogComment/{idSender}/{idReceiver}/{idBlog}")]
        private async Task<IActionResult> CreateNotificationComment(string idSender, string idReceiver, Guid idBlog)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationBlogComment/{idSender}/{idReceiver}/{idBlog}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
        }

        [HttpPost("CreateNotificationBlogReply/{idSender}/{idReceiver}/{idBlog}")]
        private async Task<IActionResult> CreateNotificationBlogReply(string idSender, string idReceiver, Guid idBlog)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationBlogReply/{idSender}/{idReceiver}/{idBlog}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
        }

        [HttpGet("GetInfoUser/{idUser}")]
        private async Task<ViewUser> GetInfoUser(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetInfoUser/{idUser}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var user = JsonSerializer.Deserialize<ViewUser>(strData, option);

                return user;
            }
            return null;
        }

        /*------------------------------------------------------------HaveBeenCalled------------------------------------------------------------*/

        [HttpGet("GetInfoBlog/{idBlog}")]
        public async Task<ActionResult<ViewBlog>> GetInfoBlog(Guid idBlog)
        {
            var blog = await _context.Blogs.FindAsync(idBlog);
            if (blog != null)
            {
                var result = new
                {
                    title = blog.title,
                    content = blog.content
                };
                return Ok(result);
            }
            return NotFound();
        }

        [HttpPut("BlockBlog/{idBlog}")]
        public async Task<IActionResult> BlockBlog(Guid idBlog)
        {
            var blog = await _context.Blogs.FindAsync(idBlog);
            if (blog != null)
            {
                if (blog.isBlock == false)
                {
                    blog.isBlock = true;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return Ok("Block blog is success");
                    }
                    return BadRequest("Block blog is fail");
                }
                else
                {
                    blog.isBlock = false;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return Ok("Unblock blog is success");
                    }
                    return BadRequest("Unblock blog is fail");
                }
            }
            return NotFound("Blog doesn't exist!");
        }

        /*------------------------------------------------------------Statistic------------------------------------------------------------*/

        [HttpGet("GetBlogStatistic")]
        public async Task<List<ViewStatistic>> GetBlogStatistic(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null)
            {
                startDate = DateTime.Today.AddDays(-30);
            }
            if (endDate == null)
            {
                endDate = new DateTime(3999, 1, 1);
            }

            var blogStatistic = await _context.Blogs.Where(x => x.createdDate >= startDate && x.createdDate <= endDate)
                .GroupBy(x => x.createdDate.Date)
                .Select(result => new ViewStatistic
                {
                    dateTime = result.Key,
                    count = result.Count()
                })
                .OrderBy(x => x.dateTime).ToListAsync();
            return blogStatistic;
        }

        /*------------------------------------------------------------Blog------------------------------------------------------------*/

        [HttpGet("SearchBlog/{nameBlog}")]
        public async Task<Response> SearchBlog(string idUser, string nameBlog)
        {
            var blogs = await _context.Blogs.Where(x => x.title.Contains(nameBlog)).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlog>>(blogs);
                foreach (var blog in result)
                {
                    blog.like = await _context.BlogsLike.Where(x => x.idBlog == blog.idBlog).CountAsync();
                    var isLike = await _context.BlogsLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == blog.idBlog);
                    if (isLike != null)
                    {
                        blog.isLike = true;
                    }
                    var infoUser = await GetInfoUser(blog.idAccount);
                    blog.fullName = infoUser.fullName;
                    blog.avatar = infoUser.avatar;
                    var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                    var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                    foreach (var image in viewImages)
                    {
                        image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                    }
                    blog.ViewBlogImages = viewImages;
                }
                return new Response(HttpStatusCode.OK, "Search blog is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Search blog is empty!");
        }

        [HttpGet("GetAllBlogsTrend/{idUser}")]
        public async Task<Response> GetAllBlogsTrend(string idUser)
        {
            var top10Blogs = await _context.Blogs.Where(x => x.isDeleted == false && x.isBlock == false).OrderByDescending(x => x.viewInDate).Take(10).AsNoTracking().ToListAsync();
            if (top10Blogs.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlog>>(top10Blogs);
                foreach (var blog in result)
                {
                    blog.like = await _context.BlogsLike.Where(x => x.idBlog == blog.idBlog).CountAsync();
                    var isLike = await _context.BlogsLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == blog.idBlog);
                    if (isLike != null)
                    {
                        blog.isLike = true;
                    }
                    var infoUser = await GetInfoUser(blog.idAccount);
                    blog.fullName = infoUser.fullName;
                    blog.avatar = infoUser.avatar;
                    var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                    var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                    foreach (var image in viewImages)
                    {
                        image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                    }
                    blog.ViewBlogImages = viewImages;
                }
                return new Response(HttpStatusCode.OK, "Get top 10 blog is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Top 10 blog is empty!");
        }

        [HttpGet("GetAllBlogs/{idUser}")]
        public async Task<Response> GetAllBlogs(string idUser)
        {
            var blogs = await _context.Blogs.Where(x => x.isDeleted == false && x.isBlock == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlog>>(blogs);
                foreach (var blog in result)
                {
                    blog.like = await _context.BlogsLike.Where(x => x.idBlog == blog.idBlog).CountAsync();
                    var isLike = await _context.BlogsLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == blog.idBlog);
                    if (isLike != null)
                    {
                        blog.isLike = true;
                    }
                    var infoUser = await GetInfoUser(blog.idAccount);
                    blog.fullName = infoUser.fullName;
                    blog.avatar = infoUser.avatar;
                    var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                    var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                    foreach (var image in viewImages)
                    {
                        image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                    }
                    blog.ViewBlogImages = viewImages;
                }
                return new Response(HttpStatusCode.OK, "Get blog list is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Blog list is empty!");
        }

        [HttpGet("GetBlogByUser/{idUser}")]
        public async Task<Response> GetBlogByUser(string idUser)
        {
            var blogs = await _context.Blogs.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogs.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlog>>(blogs);
                foreach (var blog in result)
                {
                    blog.like = await _context.BlogsLike.Where(x => x.idBlog == blog.idBlog).CountAsync();
                    var isLike = await _context.BlogsLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == blog.idBlog);
                    if (isLike != null)
                    {
                        blog.isLike = true;
                    }
                    var infoUser = await GetInfoUser(blog.idAccount);
                    blog.fullName = infoUser.fullName;
                    blog.avatar = infoUser.avatar;
                    var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                    var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                    foreach (var image in viewImages)
                    {
                        image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                    }
                    blog.ViewBlogImages = viewImages;
                }
                return new Response(HttpStatusCode.OK, "Get blog list is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Blog list is empty!");
        }

        [HttpGet("GetBlogById/{idBlog}/{idUser}")]
        public async Task<Response> GetBlogById(Guid idBlog, string idUser)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog != null)
            {
                var result = _mapper.Map<ViewBlog>(blog);
                result.like = await _context.BlogsLike.Where(x => x.idBlog == blog.idBlog).CountAsync();
                var isLike = await _context.BlogsLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == blog.idBlog);
                if (isLike != null)
                {
                    result.isLike = true;
                }
                var infoUser = await GetInfoUser(result.idAccount);
                result.fullName = infoUser.fullName;
                result.avatar = infoUser.avatar;
                var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                result.ViewBlogImages = viewImages;
                blog.view++;
                blog.viewInDate++;
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Get blog is success!", result);
            }
            return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
        }

        [HttpPost("CreateBlog/{idUser}")]
        public async Task<Response> CreateBlog(string idUser, [FromForm] CreateUpdateBlog createUpdateBlog)
        {
            /*var validator = new CreateUpdateBlogValidator();
            var validatorResult = validator.Validate(createUpdateBlog);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var blog = _mapper.Map<Blog>(createUpdateBlog);
            blog.idAccount = idUser;
            blog.isDeleted = false;
            blog.isBlock = false;
            blog.createdDate = DateTime.Now;
            await _context.Blogs.AddAsync(blog);
            if (createUpdateBlog.CreateUpdateBlogImages != null)
            {
                foreach (var image in createUpdateBlog.CreateUpdateBlogImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    BlogImage bloggImage = new BlogImage()
                    {
                        idBlog = blog.idBlog,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.BlogsImage.AddAsync(bloggImage);
                }
            }
            else
            {
                blog.BlogImages = null;
            }
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                var viewBlog = _mapper.Map<ViewBlog>(blog);
                var viewImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                viewBlog.ViewBlogImages = viewImages;
                return new Response(HttpStatusCode.OK, "Create blog is success!", viewBlog);
            }
            return new Response(HttpStatusCode.OK, "Create blog is fail!");
        }

        [HttpPut("UpdateBlog/{idBlog}")]
        public async Task<Response> UpdateBlog(Guid idBlog, [FromForm] CreateUpdateBlog createUpdateBlog)
        {
            /*var validator = new CreateUpdateBlogValidator();
            var validatorResult = validator.Validate(createUpdateBlog);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog != null)
            {
                _mapper.Map(createUpdateBlog, blog);
                var images = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                foreach (var image in images)
                {
                    _context.BlogsImage.Remove(image);
                    _saveImageService.DeleteImage(image.image!);
                }
                if (createUpdateBlog.CreateUpdateBlogImages != null)
                {
                    foreach (var image in createUpdateBlog.CreateUpdateBlogImages)
                    {
                        var imageName = await _saveImageService.SaveImage(image.ImageFile);
                        BlogImage bloggImage = new BlogImage()
                        {
                            idBlog = blog.idBlog,
                            image = imageName,
                            createdDate = DateTime.Now
                        };
                        await _context.BlogsImage.AddAsync(bloggImage);
                    }
                }
                else
                {
                    blog.BlogImages = null;
                }
                _context.Blogs.Update(blog);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    var blogImages = await _context.BlogsImage.Where(x => x.idBlog == blog.idBlog).ToListAsync();
                    var viewBlog = _mapper.Map<ViewBlog>(blog);
                    viewBlog.ViewBlogImages = _mapper.Map<List<ViewBlogImage>>(blogImages);
                    return new Response(HttpStatusCode.BadRequest, "Update blog is success!", viewBlog);
                }
                return new Response(HttpStatusCode.BadRequest, "Update blog is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
        }

        [HttpDelete("RemoveBlog/{idBlog}")]
        public async Task<Response> RemoveBlog(Guid idBlog)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog != null)
            {
                blog.isDeleted = true;
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Remove blog is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Remove blog is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
        }

        [HttpPost("LikeOrUnlikeBlog/{idUser}/{idBlog}")]
        public async Task<Response> LikeOrUnlikeBlog(string idUser, Guid idBlog)
        {
            var existLike = await _context.BlogsLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlog == idBlog);
            if (existLike == null)
            {
                var like = new BlogLike
                {
                    idAccount = idUser,
                    idBlog = idBlog,
                    createdDate = DateTime.Now
                };
                await _context.BlogsLike.AddAsync(like);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
                    await CreateNotificationBlogLike(idUser, blog.idAccount, idBlog);
                    return new Response(HttpStatusCode.NoContent, "Like blog is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Like blog is fail!");
            }
            else
            {
                _context.BlogsLike.Remove(existLike);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unlike blog is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Unlike blog is fail!");
            }
        }

        //*------------------------------------------------------------BlogComment------------------------------------------------------------*//

        [HttpGet("GetAllCommentByBlog/{idBlog}/{idUser}")]
        public async Task<Response> GetAllCommentByBlog(Guid idBlog, string idUser)
        {
            var comments = await _context.BlogsComment.Where(x => x.idBlog == idBlog && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (comments.Count > 0)
            {
                var resultComments = _mapper.Map<List<ViewBlogComment>>(comments);
                foreach (var comment in resultComments)
                {
                    comment.like = await _context.BlogsCommentLike.Where(x => x.idBlogComment == comment.idBlogComment).CountAsync();
                    var isLikeComment = await _context.BlogsCommentLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlogComment == comment.idBlogComment);
                    if (isLikeComment != null)
                    {
                        comment.isLike = true;
                    }
                    var infoUserComment = await GetInfoUser(comment.idAccount!);
                    comment.fullName = infoUserComment.fullName;
                    comment.avatar = infoUserComment.avatar;
                    var replies = await _context.BlogsReply.Where(x => x.idBlogComment == comment.idBlogComment && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                    var resultReplies = _mapper.Map<List<ViewBlogReply>>(replies);
                    foreach (var reply in resultReplies)
                    {
                        reply.like = await _context.BlogsReplyLike.Where(x => x.idBlogReply == reply.idBlogReply).CountAsync();
                        var isLikeReply = await _context.BlogsReplyLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlogReply == reply.idBlogReply);
                        if (isLikeReply != null)
                        {
                            reply.isLike = true;
                        }
                        var infoUserReply = await GetInfoUser(reply.idAccount!);
                        reply.fullName = infoUserReply.fullName;
                        reply.avatar = infoUserReply.avatar;
                    }
                    comment.ViewBlogReplies = resultReplies;
                }
                return new Response(HttpStatusCode.OK, "Get comment list is success!", resultComments);
            }
            return new Response(HttpStatusCode.NoContent, "Comment list is empty!");
        }

        [HttpPost("CreateBlogComment/{idUser}/{idBlog}/{content}")]
        public async Task<Response> CreateBlogComment(string idUser, Guid idBlog, string content)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(x => x.idBlog == idBlog);
            if (blog != null)
            {
                BlogComment blogComment = new BlogComment()
                {
                    idAccount = idUser,
                    idBlog = idBlog,
                    content = content,
                    isDeleted = false,
                    createdDate = DateTime.Now
                };
                await _context.BlogsComment.AddAsync(blogComment);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    await CreateNotificationComment(idUser, blog.idAccount, blog.idBlog);
                    return new Response(HttpStatusCode.OK, "Create comment is success!", _mapper.Map<ViewBlogComment>(blogComment));
                }
                return new Response(HttpStatusCode.BadRequest, "Create comment is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Blog doesn't exist!");
        }

        [HttpPut("UpdateBlogComment/{idBlogComment}/{content}")]
        public async Task<Response> UpdateBlogComment(Guid idBlogComment, string content)
        {
            var blogComment = await _context.BlogsComment.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment != null)
            {
                blogComment.content = content;
                _context.BlogsComment.Update(blogComment);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.OK, "Update comment is success!", _mapper.Map<ViewBlogComment>(blogComment));
                }
                return new Response(HttpStatusCode.BadRequest, "Update comment is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Comment doesn't exist!");
        }

        [HttpDelete("RemoveBlogComment/{idBlogComment}")]
        public async Task<Response> RemoveBlogComment(Guid idBlogComment)
        {
            var blogComment = await _context.BlogsComment.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment != null)
            {
                blogComment.isDeleted = true;
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0) {
                    return new Response(HttpStatusCode.NoContent, "Remove comment is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Remove comment is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Comment doesn't exist!");
        }

        [HttpPost("LikeOrUnlikeBlogComment/{idUser}/{idBlogComment}")]
        public async Task<Response> LikeOrUnlikeBlogComment(string idUser, Guid idBlogComment)
        {
            var existLike = await _context.BlogsCommentLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlogComment == idBlogComment);
            if (existLike == null)
            {
                var like = new BlogCommentLike
                {
                    idAccount = idUser,
                    idBlogComment = idBlogComment,
                    createdDate = DateTime.Now
                };
                await _context.BlogsCommentLike.AddAsync(like);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Like comment is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Like comment is fail!");
            }
            else
            {
                _context.BlogsCommentLike.Remove(existLike);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unlike comment is success!");
                }
                return new Response(HttpStatusCode.NoContent, "Unlike comment is fail!");
            }
        }

        //*------------------------------------------------------------BlogReply------------------------------------------------------------*//*

        [HttpPost("CreateBlogReply/{idUser}/{idBlogComment}/{content}")]
        public async Task<Response> CreateBlogReply(string idUser, Guid idBlogComment, string content)
        {
            var blogComment = await _context.BlogsComment.FirstOrDefaultAsync(x => x.idBlogComment == idBlogComment);
            if (blogComment != null)
            {
                BlogReply blogReply = new BlogReply()
                {
                    idAccount = idUser,
                    idBlogComment = idBlogComment,
                    content = content,
                    isDeleted = false,
                    createdDate = DateTime.Now
                };
                await _context.BlogsReply.AddAsync(blogReply);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.OK, "Create reply is success!", _mapper.Map<ViewBlogReply>(blogReply));
                }
                return new Response(HttpStatusCode.BadRequest, "Create reply is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Comment doesn't exist!");
        }

        [HttpPut("UpdateBlogReply/{idBlogReply}/{content}")]
        public async Task<Response> UpdateBlogReply(Guid idBlogReply, string content)
        {
            var blogReply = await _context.BlogsReply.FirstOrDefaultAsync(x => x.idBlogReply == idBlogReply);
            if (blogReply != null)
            {
                blogReply.content = content;
                _context.BlogsReply.Update(blogReply);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.OK, "Update reply is success!", _mapper.Map<ViewBlogReply>(blogReply));
                }
                return new Response(HttpStatusCode.BadRequest, "Update reply is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Reply doesn't exist!");
        }

        [HttpDelete("RemoveBlogReply/{idBlogReply}")]
        public async Task<Response> RemoveBlogReply(Guid idBlogReply)
        {
            var blogReply = await _context.BlogsReply.FirstOrDefaultAsync(x => x.idBlogReply == idBlogReply);
            if (blogReply != null)
            {
                blogReply.isDeleted = true;
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Remove reply is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Remove reply is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Reply doesn't exist!");
        }

        [HttpPost("LikeOrUnlikeBlogReply/{idUser}/{idBlogReply}")]
        public async Task<Response> LikeOrUnlikeBlogReply(string idUser, Guid idBlogReply)
        {
            var existLike = await _context.BlogsReplyLike.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idBlogReply == idBlogReply);
            if (existLike == null)
            {
                var like = new BlogReplyLike
                {
                    idAccount = idUser,
                    idBlogReply = idBlogReply,
                    createdDate = DateTime.Now
                };
                await _context.BlogsReplyLike.AddAsync(like);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Like blog reply is success!");
                }
                return new Response(HttpStatusCode.NoContent, "Like blog reply is fail!");
            }
            else
            {
                _context.BlogsReplyLike.Remove(existLike);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unlike blog reply is success!");
                }
                return new Response(HttpStatusCode.NoContent, "Unlike blog reply is fail!");
            }
        }
    }
}
