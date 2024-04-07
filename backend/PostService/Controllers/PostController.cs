using AutoMapper;
using BusinessObjects.Entities.Posts;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PostService.Data;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace PostService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string NotifyApiUrl { get; }
        public string UserApiUrl { get; }

        public PostController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
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

        [HttpPost("CreateNotificationPostLike/{idSender}/{idReceiver}/{idPost}/{like}")]
        private async Task<IActionResult> CreateNotificationPostLike(string idSender, string idReceiver, Guid idPost, int like)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationPostLike/{idSender}/{idReceiver}/{idPost}/{like}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
        }

        [HttpPost("CreateNotificationPostComment/{idSender}/{idReceiver}/{idPost}")]
        private async Task<IActionResult> CreateNotificationPostComment(string idSender, string idReceiver, Guid idPost)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationPostComment/{idSender}/{idReceiver}/{idPost}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
        }

        [HttpPost("CreateNotificationPostReply/{idSender}/{idReceiver}/{idPost}")]
        private async Task<IActionResult> CreateNotificationPostReply(string idSender, string idReceiver, Guid idPost)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationPostReply/{idSender}/{idReceiver}/{idPost}", null);
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

        [HttpGet("GetInfoPost/{idPost}")]
        public async Task<ActionResult<ViewPost>> GetInfoPost(Guid idPost)
        {
            var post = await _context.Posts.FindAsync(idPost);
            if (post != null)
            {
                var result = new
                {
                    idAccount = post.idAccount,
                    title = post.title,
                    content = post.content
                };
                return Ok(result);
            }
            return NotFound("Post doesn't exist!");
        }

        [HttpPut("BlockPost/{idPost}")]
        public async Task<IActionResult> BlockPost(Guid idPost)
        {
            var post = await _context.Posts.FindAsync(idPost);
            if (post != null)
            {
                if (post.isBlock == false)
                {
                    post.isBlock = true;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return Ok("Block post is success");
                    }
                    return BadRequest("Block post is fail");
                }
                else
                {
                    post.isBlock = false;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return Ok("Unblock post is success");
                    }
                    return BadRequest("Unblock post is fail");
                }
            }
            return NotFound("Post doesn't exist!");
        }

        /*------------------------------------------------------------Statistic------------------------------------------------------------*/

        [HttpGet("GetPostStatistic")]
        public async Task<List<ViewStatistic>> GetPostStatistic(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null)
            {
                startDate = DateTime.Today.AddDays(-30);
            }
            if (endDate == null)
            {
                endDate = new DateTime(3999, 1, 1);
            }

            var postStatistic = await _context.Posts.Where(x => x.createdDate >= startDate && x.createdDate <= endDate)
                .GroupBy(x => x.createdDate.Date)
                .Select(result => new ViewStatistic
                {
                    dayInMonth = result.Key,
                    count = result.Count()
                })
                .OrderBy(x => x.dayInMonth).ToListAsync();
            return postStatistic;
        }

        /*------------------------------------------------------------Post------------------------------------------------------------*/

        [HttpGet("GetAllPostsTrend/{idUser}")]
        public async Task<Response> GetAllPostsTrend(string idUser)
        {
            var top10Posts = await _context.Posts.Where(x => x.isDeleted == false && x.isBlock == false).OrderByDescending(x => x.viewInDate).Take(10).ToListAsync();
            var result = _mapper.Map<List<ViewPost>>(top10Posts);
            foreach (var post in result)
            {
                post.like = await _context.PostLikes.Where(x => x.idPost == post.idPost).CountAsync();
                var isLike = await _context.PostLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == post.idPost);
                if (isLike != null)
                {
                    post.isLike = true;
                }
                var infoUser = await GetInfoUser(post.idAccount!);
                post.fullName = infoUser.fullName;
                post.avatar = infoUser.avatar;
                post.isVerified = infoUser.isVerified;
                var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
                var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                post.ViewPostImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get top 10 blog is success!", result);
        }

        [HttpGet("GetAllPosts/{idUser}")]
        public async Task<Response> GetAllPosts(string idUser)
        {
            var posts = await _context.Posts.Where(x => x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post list is empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.like = await _context.PostLikes.Where(x => x.idPost == post.idPost).CountAsync();
                var isLike = await _context.PostLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == post.idPost);
                if (isLike != null)
                {
                    post.isLike = true;
                }
                var infoUser = await GetInfoUser(post.idAccount!);
                post.fullName = infoUser.fullName;
                post.avatar = infoUser.avatar;
                post.isVerified = infoUser.isVerified;
                var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
                var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                post.ViewPostImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get post list is success!", result);
        }

        [HttpGet("GetAllPublicPosts/{idUser}")]
        public async Task<Response> GetAllPublicPosts(string idUser)
        {
            var posts = await _context.Posts.Where(x => x.isDeleted == false && x.isBlock == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post list is empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.like = await _context.PostLikes.Where(x => x.idPost == post.idPost).CountAsync();
                var isLike = await _context.PostLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == post.idPost);
                if (isLike != null)
                {
                    post.isLike = true;
                }
                var infoUser = await GetInfoUser(post.idAccount!);
                post.fullName = infoUser.fullName;
                post.avatar = infoUser.avatar;
                post.isVerified = infoUser.isVerified;
                var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
                var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                post.ViewPostImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get post list is success!", result);
        }

        [HttpGet("GetPostByUser/{idUser}")]
        public async Task<Response> GetPostByUser(string idUser)
        {
            var posts = await _context.Posts.Where(x => x.idAccount == idUser && x.isDeleted == false && x.isBlock == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post list is empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.like = await _context.PostLikes.Where(x => x.idPost == post.idPost).CountAsync();
                var isLike = await _context.PostLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == post.idPost);
                if (isLike != null)
                {
                    post.isLike = true;
                }
                var infoUser = await GetInfoUser(post.idAccount!);
                post.fullName = infoUser.fullName;
                post.avatar = infoUser.avatar;
                post.isVerified = infoUser.isVerified;
                var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
                var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                post.ViewPostImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get post list is success!", result);
        }

        [HttpGet("GetPostById/{idPost}/{idUser}")]
        public async Task<Response> GetPostById(Guid idPost, string idUser)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.idPost == idPost && x.isBlock == false);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            var result = _mapper.Map<ViewPost>(post);
            result.like = await _context.PostLikes.Where(x => x.idPost == post.idPost).CountAsync();
            var isLike = await _context.PostLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == post.idPost);
            if (isLike != null)
            {
                result.isLike = true;
            }
            var infoUser = await GetInfoUser(result.idAccount!);
            result.fullName = infoUser.fullName;
            result.avatar = infoUser.avatar;
            result.isVerified = infoUser.isVerified;
            var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
            var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
            foreach (var image in viewImages)
            {
                image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
            }
            result.ViewPostImages = viewImages;
            post.view++;
            post.viewInDate++;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Get post is success!", result);
        }

        

        [HttpPost("CreatePost/{idUser}")]
        public async Task<Response> CreatePost(string idUser, Guid? idProject, [FromForm] CreateUpdatePost createUpdatePost)
        {
            /*var validator = new CreateUpdatePostValidator();
            var validatorResult = validator.Validate(createUpdatePost);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var post = _mapper.Map<Post>(createUpdatePost);
            post.idAccount = idUser;
            if (idProject == null)
            {
                post.idProject = null;
            }
            else
            {
                post.idProject = idProject;
            }
            post.view = 0;
            post.viewInDate = 0;
            post.isDeleted = false;
            post.createdDate = DateTime.Now;
            await _context.Posts.AddAsync(post);
            if (createUpdatePost.CreateUpdatePostImages != null)
            {
                foreach (var image in createUpdatePost.CreateUpdatePostImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    PostImage posttImage = new PostImage()
                    {
                        idPost = post.idPost,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.PostImages.AddAsync(posttImage);
                }
            }
            else
            {
                post.PostImages = null;
            }
            await _context.SaveChangesAsync();
            var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
            var viewPost = _mapper.Map<ViewPost>(post);
            var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
            viewPost.ViewPostImages = viewImages;
            return new Response(HttpStatusCode.OK, "Create post is success!", viewPost);
        }

        [HttpPut("UpdatePost/{idPost}")]
        public async Task<Response> UpdatePost(Guid idPost, [FromForm] CreateUpdatePost createUpdatePost)
        {
            /*var validator = new CreateUpdatePostValidator();
            var validatorResult = validator.Validate(createUpdatePost);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            _mapper.Map(createUpdatePost, post);
            var images = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
            foreach (var image in images)
            {
                _context.PostImages.Remove(image);
                _saveImageService.DeleteImage(image.image!);
            }
            if (createUpdatePost.CreateUpdatePostImages != null)
            {
                foreach (var image in createUpdatePost.CreateUpdatePostImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    PostImage posttImage = new PostImage()
                    {
                        idPost = post.idPost,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.PostImages.AddAsync(posttImage);
                }
            }
            else
            {
                post.PostImages = null;
            }
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
            var postImages = await _context.PostImages.Where(x => x.idPost == post.idPost).ToListAsync();
            var viewPost = _mapper.Map<ViewPost>(post);
            viewPost.ViewPostImages = _mapper.Map<List<ViewPostImage>>(postImages);
            return new Response(HttpStatusCode.OK, "Update post is success!", viewPost);
        }

        [HttpDelete("RemovePost/{idPost}")]
        public async Task<Response> RemovePost(Guid idPost)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            post.isDeleted = true;
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove post is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove post is fail!");
        }

        [HttpPost("LikeOrUnlikePost/{idUser}/{idPost}")]
        public async Task<Response> LikeOrUnlikePost(string idUser, Guid idPost)
        {
            var existLike = await _context.PostLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == idPost);
            if (existLike == null)
            {
                var like = new PostLike
                {
                    idAccount = idUser,
                    idPost = idPost,
                    createdDate = DateTime.Now
                };
                await _context.PostLikes.AddAsync(like);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    var post = await _context.Posts.FirstOrDefaultAsync(x => x.idPost == idPost);
                    var numberLike = await _context.PostLikes.Where(x => x.idPost == idPost).CountAsync();
                    await CreateNotificationPostLike(idUser, post.idAccount, idPost, numberLike);
                    return new Response(HttpStatusCode.NoContent, "Like post is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Like post is fail!");
            }
            else
            {
                _context.PostLikes.Remove(existLike);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unlike post is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Unlike post is fail!");
            }
        }

        /*------------------------------------------------------------BlogComment------------------------------------------------------------*/

        [HttpGet("GetAllPostComments/{idPost}/{idUser}")]
        public async Task<Response> GetAllPostComments(Guid idPost, string idUser)
        {
            var comments = await _context.PostComments.Where(x => x.idPost == idPost && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (comments == null)
            {
                return new Response(HttpStatusCode.NoContent, "Comment list is empty!");
            }
            var result = _mapper.Map<List<ViewPostComment>>(comments);
            foreach (var comment in result)
            {
                comment.like = await _context.PostCommentLikes.Where(x => x.idPostComment == comment.idPostComment).CountAsync();
                var isLikeComment = await _context.PostCommentLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPostComment == comment.idPostComment);
                if (isLikeComment != null)
                {
                    comment.isLike = true;
                }
                var infoUserComment = await GetInfoUser(comment.idAccount!);
                comment.fullName = infoUserComment.fullName;
                comment.avatar = infoUserComment.avatar;
                comment.isVerified = infoUserComment.isVerified;
                var replies = await _context.PostReplys.Where(x => x.idPostComment == comment.idPostComment && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                var resultReplies = _mapper.Map<List<ViewPostReply>>(replies);
                foreach (var reply in resultReplies)
                {
                    reply.like = await _context.PostReplyLikes.Where(x => x.idPostReply == reply.idPostReply).CountAsync();
                    var isLikeReply = await _context.PostReplyLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPostReply == reply.idPostReply);
                    if (isLikeReply != null)
                    {
                        reply.isLike = true;
                    }
                    var infoUserReply = await GetInfoUser(reply.idAccount!);
                    reply.fullName = infoUserReply.fullName;
                    reply.avatar = infoUserReply.avatar;
                    reply.isVerified = infoUserReply.isVerified;
                }
                comment.ViewPostReplies = resultReplies;
            }
            return new Response(HttpStatusCode.OK, "Get comment list is success!", result);
        }

        [HttpPost("CreatePostComment/{idUser}/{idPost}/{content}")]
        public async Task<Response> CreatePostComment(string idUser, Guid idPost, string content)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            PostComment postComment = new PostComment()
            {
                idAccount = idUser,
                idPost = idPost,
                content = content,
                isDeleted = false,
                createdDate = DateTime.Now
            };

            await _context.PostComments.AddAsync(postComment);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                await CreateNotificationPostComment(idUser, post.idAccount, post.idPost);
                return new Response(HttpStatusCode.OK, "Create post comment is success!", _mapper.Map<ViewPostComment>(postComment));
            }
            return new Response(HttpStatusCode.BadRequest, "Create post comment is fail!");
        }

        [HttpPut("UpdatePostComment/{idPostComment}/{content}")]
        public async Task<Response> UpdatePostComment(Guid idPostComment, string content)
        {
            var postComment = await _context.PostComments.FirstOrDefaultAsync(x => x.idPostComment == idPostComment);
            if (postComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post comment doesn't exist!");
            }
            postComment.content = content;
            _context.PostComments.Update(postComment);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Update post comment is success!", _mapper.Map<ViewPostComment>(postComment));
            }
            return new Response(HttpStatusCode.BadRequest, "Update post comment is fail!");
        }

        [HttpDelete("RemovePostComment/{idPostComment}")]
        public async Task<Response> RemovePostComment(Guid idPostComment)
        {
            var postComment = await _context.PostComments.FirstOrDefaultAsync(x => x.idPostComment == idPostComment);
            if (postComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post comment doesn't exist!");
            }
            postComment.isDeleted = true;
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove post comment is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove post comment is fail!");
        }

        [HttpPost("LikeOrUnlikePostComment/{idUser}/{idPostComment}")]
        public async Task<Response> LikeOrUnlikePostComment(string idUser, Guid idPostComment)
        {
            var existLike = await _context.PostCommentLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPostComment == idPostComment);
            if (existLike == null)
            {
                var like = new PostCommentLike
                {
                    idAccount = idUser,
                    idPostComment = idPostComment,
                    createdDate = DateTime.Now
                };
                await _context.PostCommentLikes.AddAsync(like);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Like post comment is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Like post comment is fail!");
            }
            else
            {
                _context.PostCommentLikes.Remove(existLike);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unlike post comment is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Unlike post comment is fail!");
            }
        }

        /*------------------------------------------------------------BlogReply------------------------------------------------------------*/

        [HttpPost("CreatePostReply/{idUser}/{idPostComment}/{content}")]
        public async Task<Response> CreatePostReply(string idUser, Guid idPostComment, string content)
        {
            var postComment = await _context.PostComments.FirstOrDefaultAsync(x => x.idPostComment == idPostComment);
            if (postComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post comment doesn't exist!");
            }
            PostReply postReply = new PostReply()
            {
                idAccount = idUser,
                idPostComment = idPostComment,
                content = content,
                isDeleted = false,
                createdDate = DateTime.Now
            };
            await _context.PostReplys.AddAsync(postReply);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                await CreateNotificationPostReply(idUser, postComment.idAccount, postComment.idPost);
                return new Response(HttpStatusCode.OK, "Create post reply is success!", _mapper.Map<ViewPostReply>(postReply));
            }
            return new Response(HttpStatusCode.BadRequest, "Create post reply is fail!");
        }

        [HttpPut("UpdatePostReply/{idPostReply}/{content}")]
        public async Task<Response> UpdatePostReply(Guid idPostReply, string content)
        {
            var postReply = await _context.PostReplys.FirstOrDefaultAsync(x => x.idPostReply == idPostReply);
            if (postReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post reply doesn't exist!");
            }
            postReply.content = content;
            _context.PostReplys.Update(postReply);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Update post reply is success!", _mapper.Map<ViewPostReply>(postReply));
            }
            return new Response(HttpStatusCode.BadRequest, "Update post reply is fail!");
        }

        [HttpDelete("RemovePostReply/{idPostReply}")]
        public async Task<Response> RemovePostReply(Guid idPostReply)
        {
            var postReply = await _context.PostReplys.FirstOrDefaultAsync(x => x.idPostReply == idPostReply);
            if (postReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post reply doesn't exist!");
            }
            postReply.isDeleted = true;
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove post reply is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove post reply is fail!");
        }

        [HttpPost("LikeOrUnlikePostReply/{idUser}/{idPostReply}")]
        public async Task<Response> LikeOrUnlikePostReply(string idUser, Guid idPostReply)
        {
            var existLike = await _context.PostReplyLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPostReply == idPostReply);
            if (existLike == null)
            {
                var like = new PostReplyLike
                {
                    idAccount = idUser,
                    idPostReply = idPostReply,
                    createdDate = DateTime.Now
                };
                await _context.PostReplyLikes.AddAsync(like);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Like post reply is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Like post reply is fail!");
            }
            else
            {
                _context.PostReplyLikes.Remove(existLike);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Unlike post reply is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Unlike post reply is fail!");
            }
        }
    }
}
