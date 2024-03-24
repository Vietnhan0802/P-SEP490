using AutoMapper;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Enums.Interaction.Verification;
using BusinessObjects.ViewModels.Interaction;
using BusinessObjects.ViewModels.User;
using Interaction.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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

        public string UserApiUrl { get; }

        public InteractionController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

            return user;
        }

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
                    var infoUser = await GetNameUserCurrent(verification.idAccount!);
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

        [HttpPut("UpdateVerification/{idVerification}/{status}")]
        public async Task<Response> UpdateVerification(Guid idVerification, Status status)
        {
            var verification = await _context.Verifications.FirstOrDefaultAsync(x => x.idVerification == idVerification);
            if (verification != null)
            {
                return new Response(HttpStatusCode.NotFound, "Verification doesn't exists!");
            }
            if (status == Status.Accept)
            {
                verification!.status = Status.Accept;
                verification.confirmedDate = DateTime.Now;
            }
            else
            {
                verification!.status = Status.Deny;
                verification.confirmedDate = DateTime.Now;
            }
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewVerification>(verification));
            }
            return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
        }

        /*------------------------------------------------------------AccountReport------------------------------------------------------------*/

        [HttpGet("GetAllAccountReport")]
        public async Task<Response> GetAllAccountReport(Status status)
        {
            var accountReports = await _context.AccountReports.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (accountReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewAccountReport>>(accountReports);
                foreach (var accountReport in result)
                {
                    var infoReporter = await GetNameUserCurrent(accountReport.idReporter!);
                    accountReport.nameReporter = infoReporter.fullName;
                    accountReport.avatarReporter = infoReporter.avatar;
                    var infoReported = await GetNameUserCurrent(accountReport.idReported!);
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
            var accountReport = await _context.AccountReports.FirstOrDefaultAsync(x => x.idAccountReport == idAccountReport);
            if (accountReport != null)
            {
                return new Response(HttpStatusCode.NotFound, "Account report doesn't exists!");
            }
            if (status == Status.Accept)
            {
                accountReport!.status = Status.Accept;
                accountReport.confirmedDate = DateTime.Now;
            }
            else
            {
                accountReport!.status = Status.Deny;
                accountReport.confirmedDate = DateTime.Now;
            }
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewAccountReport>(accountReport));
            }
            return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
        }

        /*------------------------------------------------------------PostReport------------------------------------------------------------*/

        [HttpGet("GetAllPostReportsAccept")]
        public async Task<int> GetAllPostReportsAccept()
        {
            var postReports = await _context.PostReports.Where(x => x.status == Status.Accept).CountAsync();
            return postReports;
        }

        [HttpGet("GetAllPostReport")]
        public async Task<Response> GetAllPostReport(Status status)
        {
            var postReports = await _context.PostReports.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (postReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewPostReport>>(postReports);
                foreach (var postReport in result)
                {
                    var infoReporter = await GetNameUserCurrent(postReport.idReporter!);
                    postReport.nameReporter = infoReporter.fullName;
                    postReport.avatarReporter = infoReporter.avatar;
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
            var postReport = await _context.PostReports.FirstOrDefaultAsync(x => x.idPostReport == idPostReport);
            if (postReport != null)
            {
                return new Response(HttpStatusCode.NotFound, "Post report doesn't exists!");
            }
            if (status == Status.Accept)
            {
                postReport!.status = Status.Accept;
                postReport.confirmedDate = DateTime.Now;
            }
            else
            {
                postReport!.status = Status.Deny;
                postReport.confirmedDate = DateTime.Now;
            }
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewPostReport>(postReport));
            }
            return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
        }

        /*------------------------------------------------------------BlogReport------------------------------------------------------------*/

        [HttpGet("GetAllBlogReportsAccept")]
        public async Task<int> GetAllBlogReportsAccept()
        {
            var blogReports = await _context.BlogReports.Where(x => x.status == Status.Accept).CountAsync();
            return blogReports;
        }

        [HttpGet("GetAllBlogReport")]
        public async Task<Response> GetAllBlogReport(Status status)
        {
            var blogReports = await _context.BlogReports.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlogReport>>(blogReports);
                foreach (var blogReport in result)
                {
                    var infoReporter = await GetNameUserCurrent(blogReport.idReporter!);
                    blogReport.nameReporter = infoReporter.fullName;
                    blogReport.avatarReporter = infoReporter.avatar;
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
                return new Response(HttpStatusCode.NotFound, "Blog report doesn't exists!");
            }
            if (status == Status.Accept)
            {
                blogReport!.status = Status.Accept;
                blogReport.confirmedDate = DateTime.Now;
            }
            else
            {
                blogReport!.status = Status.Deny;
                blogReport.confirmedDate = DateTime.Now;
            }
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewBlogReport>(blogReport));
            }
            return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
        }
    }
}
