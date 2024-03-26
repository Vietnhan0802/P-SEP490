﻿using AutoMapper;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Enums.Interaction.Verification;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Interaction;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.User;
using Interaction.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InteractionController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;

        public string BlogApiUrl { get; }
        public string PostApiUrl { get; }
        public string UserApiUrl { get; }

        public InteractionController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            BlogApiUrl = "https://localhost:7007/api/Blog";
            PostApiUrl = "https://localhost:7008/api/Post";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        /*------------------------------------------------------------CallAPI------------------------------------------------------------*/

        [HttpGet("GetInfoBlog/{idBlog}")]
        private async Task<ViewBlog> GetInfoBlog(Guid idBlog)
        {
            HttpResponseMessage response = await client.GetAsync($"{BlogApiUrl}/GetInfoBlog/{idBlog}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var blog = JsonSerializer.Deserialize<ViewBlog>(strData, option);

                return blog;
            }
            return null;
        }

        [HttpGet("GetTitlePost/{idPost}")]
        private async Task<ViewPost> GetTitlePost(Guid idPost)
        {
            HttpResponseMessage response = await client.GetAsync($"{PostApiUrl}/GetTitlePost/{idPost}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var post = JsonSerializer.Deserialize<ViewPost>(strData, option);

                return post;
            }
            return null;
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

        [HttpPut("BlockUser/{idUser}")]
        private async Task<IActionResult> BlockUser(string idUser)
        {
            HttpResponseMessage response = await client.PutAsync($"{UserApiUrl}/BlockUser/{idUser}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Block user is success!");
            }
            return BadRequest("Block user is fail");
        }

        /*------------------------------------------------------------HaveBeenCalled------------------------------------------------------------*/

        /*------------------------------------------------------------Verification------------------------------------------------------------*/

        [HttpGet("GetAllVerification")]
        public async Task<Response> GetAllVerification()
        {
            var verifications = await _context.Verifications.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (verifications.Count > 0)
            {
                var result = _mapper.Map<List<ViewVerification>>(verifications);
                foreach (var verification in result)
                {
                    var infoUser = await GetInfoUser(verification.idAccount);
                    verification.fullName = infoUser.fullName;
                    verification.avatar = infoUser.avatar;
                }
                return new Response(HttpStatusCode.OK, "Get all verifications is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all verifications is empty!");
        }

        [HttpPost("CreateVerification/{idUser}")]
        public async Task<Response> CreateVerification(string idUser)
        {
            var verificationExist = await _context.Verifications.FindAsync(idUser);
            if (verificationExist == null)
            {
                Verification verification = new Verification()
                {
                    idAccount = idUser,
                    status = Status.Waiting,
                    createdDate = DateTime.Now
                };
                await _context.Verifications.AddAsync(verification);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.OK, "Create verification is success!", _mapper.Map<ViewVerification>(verification));
                }
                return new Response(HttpStatusCode.BadRequest, "Create verification is fail!");
            }
            return new Response(HttpStatusCode.BadRequest, "Verification is exist!");
        }

        [HttpPut("UpdateVerification/{idVerification}/{status}")]
        public async Task<Response> UpdateVerification(Guid idVerification, Status status)
        {
            var verification = await _context.Verifications.FindAsync(idVerification);
            if (verification != null)
            {
                if (status == Status.Accept)
                {
                    verification.status = Status.Accept;
                    verification.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Accept verification is success!", _mapper.Map<ViewVerification>(verification));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Accept verification is fail!", _mapper.Map<ViewVerification>(verification));
                }
                else
                {
                    _context.Verifications.Remove(verification);
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Deny verification is success!", _mapper.Map<ViewVerification>(verification));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Deny verification is fail!");
                }
            }
            return new Response(HttpStatusCode.NotFound, "Verification doesn't exists!");
        }

        /*------------------------------------------------------------AccountReport------------------------------------------------------------*/

        [HttpGet("GetAllAccountReport")]
        public async Task<Response> GetAllAccountReport()
        {
            var accountReports = await _context.AccountReports.OrderBy(x => x.idReporter).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (accountReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewAccountReport>>(accountReports);
                foreach (var accountReport in result)
                {
                    var infoReporter = await GetInfoUser(accountReport.idReporter);
                    accountReport.nameReporter = infoReporter.fullName;
                    accountReport.avatarReporter = infoReporter.avatar;
                    var infoReported = await GetInfoUser(accountReport.idReported);
                    accountReport.nameReported = infoReported.fullName;
                    accountReport.avatarReported = infoReported.avatar;
                }
                return new Response(HttpStatusCode.OK, "Get all account report is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all account report is empty!");
        }

        [HttpPost("CreateAccountReport/{idReporter}/{idReported}/{content}")]
        public async Task<Response> CreateAccountReport(string idReporter, string idReported, string content)
        {
            AccountReport accountReport = new AccountReport()
            {
                idReporter = idReporter,
                idReported = idReported,
                content = content,
                status = Status.Waiting,
                createdDate = DateTime.Now
            };
            await _context.AccountReports.AddAsync(accountReport);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Create account report is success!", _mapper.Map<ViewAccountReport>(accountReport));
            }
            return new Response(HttpStatusCode.BadRequest, "Create account report is fail!");
        }

        [HttpPut("UpdateAccountReport/{idAccountReport}/{status}")]
        public async Task<Response> UpdateAccountReport(Guid idAccountReport, Status status)
        {
            var accountReport = await _context.AccountReports.FindAsync(idAccountReport);
            if (accountReport != null)
            {
                if (status == Status.Accept)
                {
                    accountReport.status = Status.Accept;
                    accountReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        var acceptCounts = await _context.AccountReports.Where(x => x.idReported == accountReport.idReported && x.status == Status.Accept).AsNoTracking().ToListAsync();
                        if (acceptCounts.Count > 4 && acceptCounts.Count < 6)
                        {
                            await BlockUser(accountReport.idReported);
                        }
                        return new Response(HttpStatusCode.OK, "Accept report is success!", _mapper.Map<ViewAccountReport>(accountReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Accept report is fail!");
                }
                else
                {
                    accountReport.status = Status.Deny;
                    accountReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Deny report is success!", _mapper.Map<ViewAccountReport>(accountReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Deny report is fail!");
                }
            }
            return new Response(HttpStatusCode.NotFound, "Account report doesn't exists!");
        }

        /*------------------------------------------------------------PostReport------------------------------------------------------------*/

        [HttpGet("GetAllPostReport")]
        public async Task<Response> GetAllPostReport()
        {
            var postReports = await _context.PostReports.OrderBy(x => x.idPosted).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (postReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewPostReport>>(postReports);
                foreach (var postReport in result)
                {
                    var infoPost = await GetTitlePost(postReport.idPosted);
                    postReport.titlePost = infoPost.title;
                    postReport.contentPost = infoPost.content;
                }
                return new Response(HttpStatusCode.OK, "Get all post report is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all post report is empty!");
        }

        [HttpPost("CreatePostReport/{idReporter}/{idPosted}/{content}")]
        public async Task<Response> CreatePostReport(string idReporter, Guid idPosted, string content)
        {
            PostReport postReport = new PostReport()
            {
                idReporter = idReporter,
                idPosted = idPosted,
                content = content,
                status = Status.Waiting,
                createdDate = DateTime.Now
            };
            await _context.PostReports.AddAsync(postReport);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Create post report is success!", _mapper.Map<ViewPostReport>(postReport));
            }
            return new Response(HttpStatusCode.BadRequest, "Create post report is fail!");
        }

        [HttpPut("UpdatePostReport/{idPostReport}/{status}")]
        public async Task<Response> UpdatePostReport(Guid idPostReport, Status status)
        {
            var postReport = await _context.PostReports.FindAsync(idPostReport);
            if (postReport != null)
            {
                if (status == Status.Accept)
                {
                    postReport.status = Status.Accept;
                    postReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Accept report is success!", _mapper.Map<ViewPostReport>(postReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Accept report is fail!");
                }
                else
                {
                    postReport.status = Status.Deny;
                    postReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Deny report is success!", _mapper.Map<ViewPostReport>(postReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Deny report is fail!");
                }
            }
            return new Response(HttpStatusCode.NotFound, "Post report doesn't exists!");
        }

        /*------------------------------------------------------------BlogReport------------------------------------------------------------*/

        [HttpGet("GetAllBlogReportsAccept")]
        public async Task<int> GetAllBlogReportsAccept()
        {
            var blogReports = await _context.BlogReports.Where(x => x.status == Status.Accept).CountAsync();
            return blogReports;
        }

        [HttpGet("GetAllBlogReport")]
        public async Task<Response> GetAllBlogReport()
        {
            var blogReports = await _context.BlogReports.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlogReport>>(blogReports);
                foreach (var blogReport in result)
                {
                    var infoBlog = await GetInfoBlog(blogReport.idBloged);
                    blogReport.titleBlog = infoBlog.title;
                    blogReport.contentBlog = infoBlog.content;
                }
                return new Response(HttpStatusCode.OK, "Get all blog report is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all blog report is empty!");
        }

        [HttpPost("CreateBlogReport/{idReporter}/{idBloged}/{content}")]
        public async Task<Response> CreateBlogReport(string idReporter, Guid idBloged, string content)
        {
            BlogReport blogReport = new BlogReport()
            {
                idReporter = idReporter,
                idBloged = idBloged,
                content = content,
                status = Status.Waiting,
                createdDate = DateTime.Now
            };
            await _context.BlogReports.AddAsync(blogReport);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Create blog report is success!", _mapper.Map<ViewBlogReport>(blogReport));
            }
            return new Response(HttpStatusCode.BadRequest, "Create blog report is fail!");
        }

        [HttpPut("UpdateBlogReport/{idBlogReport}/{status}")]
        public async Task<Response> UpdateBlogReport(Guid idBlogReport, Status status)
        {
            var blogReport = await _context.BlogReports.FirstOrDefaultAsync(x => x.idBlogReport == idBlogReport);
            if (blogReport != null)
            {
                if (status == Status.Accept)
                {
                    blogReport!.status = Status.Accept;
                    blogReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Accept report is success!", _mapper.Map<ViewBlogReport>(blogReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Accept report is fail!");
                }
                else
                {
                    blogReport!.status = Status.Deny;
                    blogReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        return new Response(HttpStatusCode.OK, "Deny report is success!", _mapper.Map<ViewBlogReport>(blogReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Deny report is fail!");
                }
            }
            return new Response(HttpStatusCode.NotFound, "Blog report doesn't exists!");
        }
    }
}
