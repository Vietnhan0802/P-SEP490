using AutoMapper;
using BusinessObjects.Entities.Post;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Post.Data;
using Post.Validator;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Post.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public PostController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
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

        /*------------------------------------------------------------Post------------------------------------------------------------*/

        /*[HttpGet("SearchPosts/{namePost}")]
        public async Task<Response> SearchPosts(string namePost)
        {
            var posts = await _context.Postts.Include(x => x.PosttImages).Where(x => x.title!.Contains(namePost)).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "No posts found with the given name!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.fullName = await GetNameUserCurrent(post.idAccount!);
                foreach (var image in post.ViewPostImages!)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Search posts success!", result);
        }*/

        [HttpGet("GetAllPosts")]
        public async Task<Response> GetAllPosts()
        {
            var posts = await _context.Postts.Where(x => x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post list is empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.like = await _context.PosttLikes.Where(x => x.idPost == post.idPost).CountAsync();
                var infoUser = await GetNameUserCurrent(post.idAccount!);
                post.fullName = infoUser.fullName;
                post.avatar = infoUser.avatar;
                var postImages = await _context.PosttImages.Where(x => x.idPost == post.idPost).ToListAsync();
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
            var posts = await _context.Postts.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post list is empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.like = await _context.PosttLikes.Where(x => x.idPost == post.idPost).CountAsync();
                var infoUser = await GetNameUserCurrent(post.idAccount!);
                post.fullName = infoUser.fullName;
                post.avatar = infoUser.avatar;
                var postImages = await _context.PosttImages.Where(x => x.idPost == post.idPost).ToListAsync();
                var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
                foreach (var image in viewImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
                post.ViewPostImages = viewImages;
            }
            return new Response(HttpStatusCode.OK, "Get post list is success!", result);
        }

        [HttpGet("GetPostById/{idPost}")]
        public async Task<Response> GetPostById(Guid idPost)
        {
            var post = await _context.Postts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            var result = _mapper.Map<ViewPost>(post);
            result.like = await _context.PosttLikes.Where(x => x.idPost == post.idPost).CountAsync();
            var infoUser = await GetNameUserCurrent(result.idAccount!);
            result.fullName = infoUser.fullName;
            result.avatar = infoUser.avatar;
            var postImages = await _context.PosttImages.Where(x => x.idPost == post.idPost).ToListAsync();
            var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
            foreach (var image in viewImages)
            {
                image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
            }
            result.ViewPostImages = viewImages;
            post.view++;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Get post is success!", result);
        }

        [HttpPost("CreatePost/{idUser}/{idProject}")]
        public async Task<Response> CreatePost(string idUser, Guid idProject, [FromForm] CreateUpdatePost createUpdatePost)
        {
            var validator = new CreateUpdatePostValidator();
            var validatorResult = validator.Validate(createUpdatePost);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var post = _mapper.Map<Postt>(createUpdatePost);
            post.idAccount = idUser;
            post.idProject = idProject;
            post.isDeleted = false;
            post.createdDate = DateTime.Now;
            await _context.Postts.AddAsync(post);
            if (createUpdatePost.CreateUpdatePostImages != null)
            {
                foreach (var image in createUpdatePost.CreateUpdatePostImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    PosttImage posttImage = new PosttImage()
                    {
                        idPost = post.idPost,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.PosttImages.AddAsync(posttImage);
                }
            }
            else
            {
                post.PosttImages = null;
            }
            await _context.SaveChangesAsync();
            var postImages = await _context.PosttImages.Where(x => x.idPost == post.idPost).ToListAsync();
            var viewPost = _mapper.Map<ViewPost>(post);
            var viewImages = _mapper.Map<List<ViewPostImage>>(postImages);
            viewPost.ViewPostImages = viewImages;
            return new Response(HttpStatusCode.OK, "Create post is success!", viewPost);
        }

        [HttpPut("UpdatePost/{idPost}")]
        public async Task<Response> UpdatePost(Guid idPost, [FromForm] CreateUpdatePost createUpdatePost)
        {
            var validator = new CreateUpdatePostValidator();
            var validatorResult = validator.Validate(createUpdatePost);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var post = await _context.Postts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            _mapper.Map(createUpdatePost, post);
            var images = await _context.PosttImages.Where(x => x.idPost == post.idPost).ToListAsync();
            foreach (var image in images)
            {
                _context.PosttImages.Remove(image);
                _saveImageService.DeleteImage(image.image!);
            }
            if (createUpdatePost.CreateUpdatePostImages != null)
            {
                foreach (var image in createUpdatePost.CreateUpdatePostImages)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    PosttImage posttImage = new PosttImage()
                    {
                        idPost = post.idPost,
                        image = imageName,
                        createdDate = DateTime.Now
                    };
                    await _context.PosttImages.AddAsync(posttImage);
                }
            }
            else
            {
                post.PosttImages = null;
            }
            _context.Postts.Update(post);
            await _context.SaveChangesAsync();
            var postImages = await _context.PosttImages.Where(x => x.idPost == post.idPost).ToListAsync();
            var viewPost = _mapper.Map<ViewPost>(post);
            viewPost.ViewPostImages = _mapper.Map<List<ViewPostImage>>(postImages);
            return new Response(HttpStatusCode.BadRequest, "Update post is success!", viewPost);
        }

        [HttpDelete("RemovePost/{idPost}")]
        public async Task<Response> RemovePost(Guid idPost)
        {
            var post = await _context.Postts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            post.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove post is success!");
        }

        [HttpPost("LikeOrUnlikePost/{idUser}/{idPost}")]
        public async Task<Response> LikeOrUnlikePost(string idUser, Guid idPost)
        {
            var existLike = await _context.PosttLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPost == idPost);
            if (existLike == null)
            {
                var like = new PosttLike
                {
                    idAccount = idUser,
                    idPost = idPost,
                    createdDate = DateTime.Now
                };
                await _context.PosttLikes.AddAsync(like);
            }
            else
            {
                _context.PosttLikes.Remove(existLike);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Like or unlike post is success!");
        }

        /*------------------------------------------------------------BlogComment------------------------------------------------------------*/

        [HttpGet("GetAllPostComments/{idPost}")]
        public async Task<Response> GetAllPostComments(Guid idPost)
        {
            var comments = await _context.PosttComments.Where(x => x.idPost == idPost && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (comments == null)
            {
                return new Response(HttpStatusCode.NoContent, "Comment list is empty!");
            }
            var result = _mapper.Map<List<ViewPostComment>>(comments);
            foreach (var comment in result)
            {
                comment.like = await _context.PosttCommentLikes.Where(x => x.idPostComment == comment.idPostComment).CountAsync();
                var infoUserComment = await GetNameUserCurrent(comment.idAccount!);
                comment.fullName = infoUserComment.fullName;
                comment.avatar = infoUserComment.avatar;
                var replies = await _context.PosttReplies.Where(x => x.idPostComment == comment.idPostComment && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                var resultReplies = _mapper.Map<List<ViewPostReply>>(replies);
                foreach (var reply in resultReplies)
                {
                    reply.like = await _context.PosttReplyLikes.Where(x => x.idPostReply == reply.idPostReply).CountAsync();
                    var infoUserReply = await GetNameUserCurrent(reply.idAccount!);
                    reply.fullName = infoUserReply.fullName;
                    reply.avatar = infoUserReply.avatar;
                }
                comment.ViewPostReplies = resultReplies;
            }
            return new Response(HttpStatusCode.OK, "Get comment list is success!", result);
        }

        [HttpPost("CreatePostComment/{idUser}/{idPost}")]
        public async Task<Response> CreatePostComment(string idUser, Guid idPost, CreateUpdatePostComment createUpdatePostComment)
        {
            var validator = new CreateUpdatePostCommentValidatior();
            var validatorResult = validator.Validate(createUpdatePostComment);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var post = await _context.Postts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exist!");
            }
            var postComment = _mapper.Map<PosttComment>(createUpdatePostComment);
            postComment.idAccount = idUser;
            postComment.idPost = idPost;
            postComment.isDeleted = false;
            postComment.createdDate = DateTime.Now;
            await _context.PosttComments.AddAsync(postComment);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create post comment is success!", _mapper.Map<ViewPostComment>(postComment));
        }

        [HttpPut("UpdatePostComment/{idPostComment}")]
        public async Task<Response> UpdatePostComment(Guid idPostComment, [FromForm] CreateUpdatePostComment createUpdatePostComment)
        {
            var validator = new CreateUpdatePostCommentValidatior();
            var validatorResult = validator.Validate(createUpdatePostComment);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var postComment = await _context.PosttComments.FirstOrDefaultAsync(x => x.idPostComment == idPostComment);
            if (postComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post comment doesn't exist!");
            }
            _mapper.Map(createUpdatePostComment, postComment);
            _context.PosttComments.Update(postComment);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update post comment is success!", _mapper.Map<ViewPostComment>(postComment));
        }

        [HttpDelete("RemovePostComment/{idPostComment}")]
        public async Task<Response> RemovePostComment(Guid idPostComment)
        {
            var postComment = await _context.PosttComments.FirstOrDefaultAsync(x => x.idPostComment == idPostComment);
            if (postComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post comment doesn't exist!");
            }
            postComment.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove post comment is success!");
        }

        [HttpPost("LikeOrUnlikePostComment/{idUser}/{idPostComment}")]
        public async Task<Response> LikeOrUnlikePostComment(string idUser, Guid idPostComment)
        {
            var existLike = await _context.PosttCommentLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPostComment == idPostComment);
            if (existLike == null)
            {
                var like = new PosttCommentLike
                {
                    idAccount = idUser,
                    idPostComment = idPostComment,
                    createdDate = DateTime.Now
                };
                await _context.PosttCommentLikes.AddAsync(like);
            }
            else
            {
                _context.PosttCommentLikes.Remove(existLike);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Like or unlike post comment is success!");
        }

        /*------------------------------------------------------------BlogReply------------------------------------------------------------*/

        [HttpPost("CreatePostReply/{idUser}/{idPostComment}")]
        public async Task<Response> CreatePostReply(string idUser, Guid idPostComment, CreateUpdatePostReply createUpdatePostReply)
        {
            var validator = new CreateUpdatePostReplyValidator();
            var validatorResult = validator.Validate(createUpdatePostReply);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var postComment = await _context.PosttComments.FirstOrDefaultAsync(x => x.idPostComment == idPostComment);
            if (postComment == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post comment doesn't exist!");
            }
            var postReply = _mapper.Map<PosttReply>(createUpdatePostReply);
            postReply.idAccount = idUser;
            postReply.idPostComment = idPostComment;
            postReply.isDeleted = false;
            postReply.createdDate = DateTime.Now;
            await _context.PosttReplies.AddAsync(postReply);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create post reply is success!", _mapper.Map<ViewPostReply>(postReply));
        }

        [HttpPut("UpdatePostReply/{idPostReply}")]
        public async Task<Response> UpdatePostReply(Guid idPostReply, CreateUpdatePostReply createUpdatePostReply)
        {
            var validator = new CreateUpdatePostReplyValidator();
            var validatorResult = validator.Validate(createUpdatePostReply);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }
            var postReply = await _context.PosttReplies.FirstOrDefaultAsync(x => x.idPostReply == idPostReply);
            if (postReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post reply doesn't exist!");
            }
            _mapper.Map(createUpdatePostReply, postReply);
            _context.PosttReplies.Update(postReply);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update post reply is success!", _mapper.Map<ViewPostReply>(postReply));
        }

        [HttpDelete("RemovePostReply/{idPostReply}")]
        public async Task<Response> RemovePostReply(Guid idPostReply)
        {
            var postReply = await _context.PosttReplies.FirstOrDefaultAsync(x => x.idPostReply == idPostReply);
            if (postReply == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post reply doesn't exist!");
            }
            postReply.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove post reply is success!");
        }

        [HttpPost("LikeOrUnlikePostReply/{idUser}/{idPostReply}")]
        public async Task<Response> LikeOrUnlikePostReply(string idUser, Guid idPostReply)
        {
            var existLike = await _context.PosttReplyLikes.FirstOrDefaultAsync(x => x.idAccount == idUser && x.idPostReply == idPostReply);
            if (existLike == null)
            {
                var like = new PosttReplyLike
                {
                    idAccount = idUser,
                    idPostReply = idPostReply,
                    createdDate = DateTime.Now
                };
                await _context.PosttReplyLikes.AddAsync(like);
            }
            else
            {
                _context.PosttReplyLikes.Remove(existLike);
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Like or unlike post reply is success!");
        }
    }
}
