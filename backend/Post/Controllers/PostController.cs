using AutoMapper;
using BusinessObjects.Entities.Blog;
using BusinessObjects.Entities.Post;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Post.Data;
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

        /*------------------------------------------------------------Post------------------------------------------------------------*/

        [HttpGet("SearchPosts/{namePost}")]
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
                foreach (var image in post.PosttImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Search posts success!", result);
        }

        [HttpGet("GetAllPosts")]
        public async Task<Response> GetAllPosts()
        {
            var posts = await _context.Postts.Include(x => x.PosttImages).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "List posts doesn't empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.fullName = await GetNameUserCurrent(post.idAccount!);
                foreach (var image in post.PosttImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Get list posts is success!", result);
        }

        [HttpGet("GetPostByUser/{idUser}")]
        public async Task<Response> GetPostByUser(string idUser)
        {
            var posts = await _context.Postts.Include(x => x.PosttImages).Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (posts == null)
            {
                return new Response(HttpStatusCode.NoContent, "List posts doesn't empty!");
            }
            var result = _mapper.Map<List<ViewPost>>(posts);
            foreach (var post in result)
            {
                post.fullName = await GetNameUserCurrent(post.idAccount!);
                foreach (var image in post.PosttImages)
                {
                    image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
                }
            }
            return new Response(HttpStatusCode.OK, "Get list posts is success!", result);
        }

        [HttpGet("GetPostById/{idPost}")]
        public async Task<Response> GetPostById(Guid idPost)
        {
            var post = await _context.Postts.Include(x => x.PosttImages).FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exists!");
            }
            post.view++;
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewPost>(post);
            result.fullName = await GetNameUserCurrent(result.idAccount!);
            foreach (var image in result.PosttImages)
            {
                image.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.image);
            }
            return new Response(HttpStatusCode.OK, "Get post is success!", result);
        }

        [HttpPost("CreatePost")]
        public async Task<Response> CreatePost(string idUser, CreateUpdatePost createUpdatePost)
        {
            var post = _mapper.Map<Postt>(createUpdatePost);
            if (createUpdatePost.CreateUpdateImagePosts != null)
            {
                foreach (var image in createUpdatePost.CreateUpdateImagePosts)
                {
                    var imageName = await _saveImageService.SaveImage(image.ImageFile);
                    post.PosttImages.Add(new PosttImage { image = imageName });
                }
                post.idAccount = idUser;
                post.isDeleted = false;
                post.createdDate = DateTime.Now;
                await _context.Postts.AddAsync(post);
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Create post is success!", _mapper.Map<ViewPost>(post));
            }
            return new Response(HttpStatusCode.BadRequest, "Create post is fail!");
        }

        [HttpPut("UpdatePost/{idPost}")]
        public async Task<Response> UpdatePost(Guid idPost, CreateUpdatePost createUpdatePost)
        {
            var post = await _context.Postts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exists!");
            }
            if (createUpdatePost.CreateUpdateImagePosts != null)
            {
                foreach (var imageOld in post.PosttImages)
                {
                    _saveImageService.DeleteImage(imageOld.image);
                }
                var result = _mapper.Map(createUpdatePost, post);
                foreach (var imageNew in result.PosttImages)
                {
                    imageNew.image = await _saveImageService.SaveImage(imageNew.ImageFile);
                    result.PosttImages.Add(imageNew);
                }
                _context.Postts.Update(result);
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Update post is success!", _mapper.Map<ViewPost>(result));
            }
            return new Response(HttpStatusCode.BadRequest, "Update post is fail!");
        }

        [HttpDelete("RemovePost/{idPost}")]
        public async Task<Response> RemovePost(Guid idPost)
        {
            var post = await _context.Postts.FirstOrDefaultAsync(x => x.idPost == idPost);
            if (post == null)
            {
                return new Response(HttpStatusCode.NotFound, "Post doesn't exists!");
            }
            post.isDeleted = true;
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove post is success!");
        }

        [HttpGet("GetTotalLikePosts/{idPost}")]
        public async Task<Response> GetTotalLikePosts(Guid idPost)
        {
            var totalLikePosts = await _context.PosttLikes.Where(x => x.idPost == idPost).CountAsync();
            return new Response(HttpStatusCode.OK, "Get all like posts is success!", totalLikePosts);
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
            var comments = await _context.PosttComments.Where(x => x.idPost == idPost).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (comments == null)
            {
                return new Response(HttpStatusCode.NoContent, "List comments doesn't empty!");
            }
            var result = _mapper.Map<List<ViewPostComment>>(comments);
            foreach (var comment in result)
            {
                comment.fullName = await GetNameUserCurrent(comment.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Get list comments is success!", result);
        }

        [HttpPost("CreatePostComment/{idUser}/{idPost}")]
        public async Task<Response> CreatePostComment(string idUser, Guid idPost, CreateUpdatePostComment createUpdatePostComment)
        {
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
        public async Task<Response> UpdatePostComment(Guid idPostComment, CreateUpdatePostComment createUpdatePostComment)
        {
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

        [HttpGet("GetTotalLikePostComments/{idPostComment}")]
        public async Task<Response> GetTotalLikePostComments(Guid idPostComment)
        {
            var totalLikePostComments = await _context.PosttCommentLikes.Where(x => x.idPostComment == idPostComment).CountAsync();
            return new Response(HttpStatusCode.OK, "Get all like post comments is success!", totalLikePostComments);
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

        [HttpGet("GetAllPostReplies/{idPostComment}")]
        public async Task<Response> GetAllPostReplies(Guid idPostComment)
        {
            var replies = await _context.PosttReplies.Where(x => x.idPostComment == idPostComment).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (replies == null)
            {
                return new Response(HttpStatusCode.NoContent, "List replies doesn't empty!");
            }
            var result = _mapper.Map<List<ViewPostReply>>(replies);
            foreach (var reply in result)
            {
                reply.fullName = await GetNameUserCurrent(reply.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Get list replies is success!", result);
        }

        [HttpPost("CreatePostReply/{idUser}/{idPostComment}")]
        public async Task<Response> CreatePostReply(string idUser, Guid idPostComment, CreateUpdatePostReply createUpdatePostReply)
        {
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

        [HttpGet("GetTotalLikePostReplies/{idPostReply}")]
        public async Task<Response> GetTotalLikePostReplies(Guid idPostReply)
        {
            var totalLikePostReplies = await _context.PosttReplyLikes.Where(x => x.idPostReply == idPostReply).CountAsync();
            return new Response(HttpStatusCode.OK, "Get all like post replies is success!", totalLikePostReplies);
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
