using AutoMapper;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Enums.Interaction.Verification;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Interaction;
using BusinessObjects.ViewModels.Post;
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;
using Interaction.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
        public string FollowApiUrl { get; }
        public string PostApiUrl { get; }
        public string ProjectApiUrl { get; }
        public string UserApiUrl { get; }

        public InteractionController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            BlogApiUrl = "https://localhost:7007/api/Blog";
            FollowApiUrl = "https://localhost:7002/api/Follow";
            PostApiUrl = "https://localhost:7008/api/Post";
            ProjectApiUrl = "https://localhost:7005/api/ProjectInfo";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        /*------------------------------------------------------------CallAPI------------------------------------------------------------*/

        [HttpGet("GetTotalProjects/{idOwner}")]
        private async Task<int> GetTotalProjects(string idOwner)
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetTotalProjects/{idOwner}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var projects = JsonSerializer.Deserialize<int>(strData, option);

                return projects!;
            }
            return 0;
        }

        [HttpGet("GetTotalFollowers/{idOwner}")]
        private async Task<int> GetTotalFollowers(string idOwner)
        {
            HttpResponseMessage response = await client.GetAsync($"{FollowApiUrl}/GetTotalFollowers/{idOwner}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var followers = JsonSerializer.Deserialize<int>(strData, option);

                return followers!;
            }
            return 0;
        }

        [HttpPut("ChangeVerification/{idUser}")]
        private async Task<IActionResult> ChangeVerification(string idUser)
        {
            HttpResponseMessage response = await client.PutAsync($"{UserApiUrl}/ChangeVerification/{idUser}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Change verification user is success!");
            }
            return BadRequest("Change verification user is fail");
        }

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

        [HttpGet("GetInfoPost/{idPost}")]
        private async Task<ViewPost> GetInfoPost(Guid idPost)
        {
            HttpResponseMessage response = await client.GetAsync($"{PostApiUrl}/GetInfoPost/{idPost}");
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

        [HttpPut("BlockPost/{idPost}")]
        private async Task<IActionResult> BlockPost(Guid idPost)
        {
            HttpResponseMessage response = await client.PutAsync($"{BlogApiUrl}/BlockPost/{idPost}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Block post is success!");
            }
            return BadRequest("Block post is fail");
        }

        [HttpPut("BlockBlog/{idBlog}")]
        private async Task<IActionResult> BlockBlog(Guid idBLog)
        {
            HttpResponseMessage response = await client.PutAsync($"{BlogApiUrl}/BlockBlog/{idBLog}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Block blog is success!");
            }
            return BadRequest("Block blog is fail");
        }

        /*------------------------------------------------------------HaveBeenCalled------------------------------------------------------------*/

        /*------------------------------------------------------------Statistic------------------------------------------------------------*/

        [HttpGet("GetAllStatusVerificationInSystem")]
        public async Task<List<ViewAccountStatistic>> GetAllStatusVerificationInSystem()
        {
            var verificationWaiting = await _context.Verifications.CountAsync(x => x.status == Status.Waiting);
            var verificationAccept = await _context.Verifications.CountAsync(x => x.status == Status.Accept);
            var verificationDeny = await _context.Verifications.CountAsync(x => x.status == Status.Deny);

            return new List<ViewAccountStatistic>
            {
                new ViewAccountStatistic { type = "Verification is waiting", count = verificationWaiting },
                new ViewAccountStatistic { type = "Verification is accept", count = verificationAccept },
                new ViewAccountStatistic { type = "Verification is deny", count = verificationDeny },
            };
        }

        [HttpGet("GetVerificationStatistic/{statisticType}")]
        public async Task<List<ViewStatistic>> GetVerificationStatistic(string statisticType)
        {
            var startDate = DateTime.Now.ToString("yyyy-MM-dd");

            var startOfWeek = DateTime.Parse(startDate).AddDays(-(int)DateTime.Parse(startDate).DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            var startOfMonth = new DateTime(DateTime.Parse(startDate).Year, DateTime.Parse(startDate).Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);
            var startOfYear = new DateTime(DateTime.Parse(startDate).Year, 1, 1);
            var endOfYear = startOfYear.AddYears(1);
            var verificationStatistic = new List<ViewStatistic>();
            if (statisticType == "today")
            {
                var verifications = await _context.Verifications
                .Where(x => x.status == Status.Accept && x.createdDate >= DateTime.Parse(startDate) && x.createdDate < DateTime.Parse(startDate).AddDays(1))
                .ToListAsync();

                for (int hour = 0; hour < 24; hour++)
                {
                    var count = verifications.Count(x => x.createdDate.Hour == hour);
                    verificationStatistic.Add(new ViewStatistic
                    {
                        hourInDay = hour,
                        count = count
                    });
                }

                return verificationStatistic;
            }
            else if (statisticType == "week")
            {
                var verifications = await _context.Verifications
                .Where(x => x.status == Status.Accept && x.createdDate >= startOfWeek && x.createdDate < endOfWeek)
                .ToListAsync();

                for (int day = 0; day < 7; day++)
                {
                    var dayOfWeek = (DayOfWeek)day;
                    var count = verifications.Count(x => x.createdDate.DayOfWeek == dayOfWeek);
                    verificationStatistic.Add(new ViewStatistic
                    {
                        dayInWeek = dayOfWeek.ToString(),
                        count = count
                    });
                }

                return verificationStatistic;
            }
            else if (statisticType == "month")
            {
                var verifications = await _context.Verifications
                .Where(x => x.status == Status.Accept && x.createdDate >= startOfMonth && x.createdDate < endOfMonth)
                .ToListAsync();

                var daysInMonth = (endOfMonth - startOfMonth).Days;
                for (int day = 0; day < daysInMonth; day++)
                {
                    var date = startOfMonth.AddDays(day);
                    var count = verifications.Count(x => x.createdDate.Date == date.Date);
                    verificationStatistic.Add(new ViewStatistic
                    {
                        dayInMonth = date.Date,
                        count = count
                    });
                }

                return verificationStatistic;
            }
            else if (statisticType == "year")
            {
                var verifications = await _context.Verifications
                .Where(x => x.status == Status.Accept && x.createdDate >= startOfYear && x.createdDate < endOfYear)
                .ToListAsync();

                for (int month = 1; month <= 12; month++)
                {
                    var monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month);
                    var count = verifications.Count(x => x.createdDate.Month == month);
                    verificationStatistic.Add(new ViewStatistic
                    {
                        monthInYear = monthName,
                        count = count
                    });
                }

                return verificationStatistic;
            }
            return null;
        }

        [HttpGet("GetAllReportInSystem")]
        public async Task<List<ViewAccountStatistic>> GetAllReportInSystem()
        {
            var reportAccount = await _context.AccountReports.CountAsync();
            var reportBlog = await _context.BlogReports.CountAsync();
            var reportPost = await _context.PostReports.CountAsync();

            return new List<ViewAccountStatistic>
            {
                new ViewAccountStatistic { type = "Report Account", count = reportAccount },
                new ViewAccountStatistic { type = "Report Blog", count = reportBlog },
                new ViewAccountStatistic { type = "Report Post", count = reportPost },
            };
        }

        [HttpGet("GetReportStatistic/{statisticType}")]
        public async Task<List<ViewStatistic>> GetReportStatistic(string statisticType)
        {
            var startDate = DateTime.Now.ToString("yyyy-MM-dd");

            var startOfWeek = DateTime.Parse(startDate).AddDays(-(int)DateTime.Parse(startDate).DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            var startOfMonth = new DateTime(DateTime.Parse(startDate).Year, DateTime.Parse(startDate).Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);
            var startOfYear = new DateTime(DateTime.Parse(startDate).Year, 1, 1);
            var endOfYear = startOfYear.AddYears(1);
            var reportStatistic = new List<ViewStatistic>();
            if (statisticType == "today")
            {
                var accountReports = await _context.AccountReports
                .Where(x => x.createdDate >= DateTime.Parse(startDate) && x.createdDate < DateTime.Parse(startDate).AddDays(1))
                .ToListAsync();

                var blogReports = await _context.BlogReports
                .Where(x => x.createdDate >= DateTime.Parse(startDate) && x.createdDate < DateTime.Parse(startDate).AddDays(1))
                .ToListAsync();

                var postReports = await _context.PostReports
                .Where(x => x.createdDate >= DateTime.Parse(startDate) && x.createdDate < DateTime.Parse(startDate).AddDays(1))
                .ToListAsync();

                for (int hour = 0; hour < 24; hour++)
                {
                    var count = (accountReports.Count(x => x.createdDate.Hour == hour)) + (blogReports.Count(x => x.createdDate.Hour == hour)) + (postReports.Count(x => x.createdDate.Hour == hour));
                    reportStatistic.Add(new ViewStatistic
                    {
                        hourInDay = hour,
                        count = count
                    });
                }

                return reportStatistic;
            }
            else if (statisticType == "week")
            {
                var accountReports = await _context.AccountReports
                .Where(x => x.createdDate >= startOfWeek && x.createdDate < endOfWeek)
                .ToListAsync();

                var blogReports = await _context.BlogReports
                .Where(x => x.createdDate >= startOfWeek && x.createdDate < endOfWeek)
                .ToListAsync();

                var postReports = await _context.PostReports
                .Where(x => x.createdDate >= startOfWeek && x.createdDate < endOfWeek)
                .ToListAsync();

                for (int day = 0; day < 7; day++)
                {
                    var dayOfWeek = (DayOfWeek)day;
                    var count = (accountReports.Count(x => x.createdDate.DayOfWeek == dayOfWeek)) + (blogReports.Count(x => x.createdDate.DayOfWeek == dayOfWeek)) + (postReports.Count(x => x.createdDate.DayOfWeek == dayOfWeek));
                    reportStatistic.Add(new ViewStatistic
                    {
                        dayInWeek = dayOfWeek.ToString(),
                        count = count
                    });
                }

                return reportStatistic;
            }
            else if (statisticType == "month")
            {
                var accountReports = await _context.AccountReports
                .Where(x => x.createdDate >= startOfMonth && x.createdDate < endOfMonth)
                .ToListAsync();

                var blogReports = await _context.BlogReports
                .Where(x => x.createdDate >= startOfMonth && x.createdDate < endOfMonth)
                .ToListAsync();

                var postReports = await _context.PostReports
                .Where(x => x.createdDate >= startOfMonth && x.createdDate < endOfMonth)
                .ToListAsync();

                var daysInMonth = (endOfMonth - startOfMonth).Days;
                for (int day = 0; day < daysInMonth; day++)
                {
                    var date = startOfMonth.AddDays(day);
                    var count = (accountReports.Count(x => x.createdDate.Date == date.Date)) + (blogReports.Count(x => x.createdDate.Date == date.Date)) + (postReports.Count(x => x.createdDate.Date == date.Date));
                    reportStatistic.Add(new ViewStatistic
                    {
                        dayInMonth = date.Date,
                        count = count
                    });
                }

                return reportStatistic;
            }
            else if (statisticType == "year")
            {
                var accountReports = await _context.AccountReports
                .Where(x => x.createdDate >= startOfYear && x.createdDate < endOfYear)
                .ToListAsync();

                var blogReports = await _context.BlogReports
                .Where(x => x.createdDate >= startOfYear && x.createdDate < endOfYear)
                .ToListAsync();

                var postReports = await _context.PostReports
                .Where(x => x.createdDate >= startOfYear && x.createdDate < endOfYear)
                .ToListAsync();

                for (int month = 1; month <= 12; month++)
                {
                    var monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month);
                    var count = (accountReports.Count(x => x.createdDate.Month == month)) + (blogReports.Count(x => x.createdDate.Month == month)) + (postReports.Count(x => x.createdDate.Month == month));
                    reportStatistic.Add(new ViewStatistic
                    {
                        monthInYear = monthName,
                        count = count
                    });
                }

                return reportStatistic;
            }
            return null;
        }

        /*------------------------------------------------------------Verification------------------------------------------------------------*/

        [HttpGet("GetAllVerification")]
        public async Task<Response> GetAllVerification()
        {
            var verifications = await _context.Verifications.Where(x => x.status == Status.Waiting).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (verifications.Count > 0)
            {
                var result = _mapper.Map<List<ViewVerification>>(verifications);
                foreach (var verification in result)
                {
                    var infoUser = await GetInfoUser(verification.idAccount);
                    verification.project = await GetTotalProjects(verification.idAccount);
                    verification.follower = await GetTotalFollowers(verification.idAccount);
                    verification.email = infoUser.email;
                    verification.fullName = infoUser.fullName;
                    verification.avatar = infoUser.avatar;
                    verification.isVerified = infoUser.isVerified;
                }
                return new Response(HttpStatusCode.OK, "Get all verifications is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all verifications is empty!");
        }

        [HttpGet("VerificationAccepted")]
        public async Task<Response> VerificationAccepted()
        {
            var verifications = await _context.Verifications.Where(x => x.status == Status.Accept).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (verifications.Count > 0)
            {
                var result = _mapper.Map<List<ViewVerification>>(verifications);
                foreach (var verification in result)
                {
                    var infoUser = await GetInfoUser(verification.idAccount);
                    verification.project = await GetTotalProjects(verification.idAccount);
                    verification.follower = await GetTotalFollowers(verification.idAccount);
                    verification.email = infoUser.email;
                    verification.fullName = infoUser.fullName;
                    verification.avatar = infoUser.avatar;
                    verification.isVerified = infoUser.isVerified;
                }
                return new Response(HttpStatusCode.OK, "Get all verifications is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all verifications is empty!");
        }

        [HttpPost("CreateVerification/{idUser}")]
        public async Task<Response> CreateVerification(string idUser)
        {
            var verificationExist = await _context.Verifications.FirstOrDefaultAsync(x => x.idAccount == idUser);
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

        [HttpPut("AcceptVerification/{idVerification}/{status}")]
        public async Task<Response> AcceptVerification(Guid idVerification, Status status)
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
                        await ChangeVerification(verification.idAccount);
                        return new Response(HttpStatusCode.OK, "Accept verification is success!", _mapper.Map<ViewVerification>(verification));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Accept verification is fail!");
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

        [HttpDelete("RemoveVerification/{idVerification}")]
        public async Task<Response> RemoveVerification(Guid idVerification)
        {
            var verification = await _context.Verifications.FindAsync(idVerification);
            if (verification != null)
            {
                _context.Verifications.Remove(verification);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    await ChangeVerification(verification.idAccount);
                    return new Response(HttpStatusCode.OK, "Remove verification is success!", _mapper.Map<ViewVerification>(verification));
                }
                return new Response(HttpStatusCode.BadRequest, "Remove verification is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Verification doesn't exists!");
        }

        /*------------------------------------------------------------AccountReport------------------------------------------------------------*/

        [HttpGet("GetAllAccountReport")]
        public async Task<Response> GetAllAccountReport()
        {
            var accountReports = await _context.AccountReports.Where(x => x.status == Status.Waiting).OrderBy(x => x.idReporter).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (accountReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewAccountReport>>(accountReports);
                foreach (var accountReport in result)
                {
                    var infoReporter = await GetInfoUser(accountReport.idReporter);
                    accountReport.emailReporter = infoReporter.email;
                    accountReport.nameReporter = infoReporter.fullName;
                    accountReport.avatarReporter = infoReporter.avatar;
                    accountReport.isVerified = infoReporter.isVerified;
                    var infoReported = await GetInfoUser(accountReport.idReported);
                    accountReport.emailReported = infoReported.email;
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

        [HttpPut("AcceptAccountReport/{idAccountReport}/{status}")]
        public async Task<Response> AcceptAccountReport(Guid idAccountReport, Status status)
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
                        var acceptCounts = await _context.AccountReports.CountAsync(x => x.idReported == accountReport.idReported && x.status == Status.Accept);
                        if (acceptCounts > 4 && acceptCounts < 6)
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
            var postReports = await _context.PostReports.Where(x => x.status == Status.Waiting).OrderBy(x => x.idPosted).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (postReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewPostReport>>(postReports);
                foreach (var postReport in result)
                {
                    var infoUser = await GetInfoUser(postReport.idReporter);
                    postReport.emailReporter = infoUser.email;
                    postReport.nameReporter = infoUser.fullName;
                    postReport.avatarReporter = infoUser.avatar;
                    postReport.isVerifiedReporter = infoUser.isVerified;
                    var infoPost = await GetInfoPost(postReport.idPosted);
                    postReport.titlePost = infoPost.title;
                    postReport.contentPost = infoPost.content;
                    var infoUserPost = await GetInfoUser(infoPost.idAccount);
                    postReport.accountPosted = infoUserPost.Id;
                    postReport.emailPosted = infoUserPost.email;
                    postReport.namePosted = infoUserPost.fullName;
                    postReport.avatarPosted = infoUserPost.avatar;
                    postReport.isVerifiedPosted = infoUserPost.isVerified;
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

        [HttpPut("AcceptPostReport/{idPostReport}/{status}")]
        public async Task<Response> AcceptPostReport(Guid idPostReport, Status status)
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
                        var postCount = await _context.PostReports.CountAsync(x => x.idPosted == postReport.idPosted && x.status == Status.Accept);
                        if (postCount > 4 && postCount < 6)
                        {
                            await BlockPost(postReport.idPosted);
                        }
                        return new Response(HttpStatusCode.OK, "Deny report is success!", _mapper.Map<ViewPostReport>(postReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Deny report is fail!");
                }
            }
            return new Response(HttpStatusCode.NotFound, "Post report doesn't exists!");
        }

        /*------------------------------------------------------------BlogReport------------------------------------------------------------*/

        [HttpGet("GetAllBlogReport")]
        public async Task<Response> GetAllBlogReport()
        {
            var blogReports = await _context.BlogReports.Where(x => x.status == Status.Waiting).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogReports.Count > 0)
            {
                var result = _mapper.Map<List<ViewBlogReport>>(blogReports);
                foreach (var blogReport in result)
                {
                    var infoUser = await GetInfoUser(blogReport.idReporter);
                    blogReport.emailReporter = infoUser.email;
                    blogReport.nameReporter = infoUser.fullName;
                    blogReport.avatarReporter = infoUser.avatar;
                    blogReport.isVerifiedReporter = infoUser.isVerified;
                    var infoBlog = await GetInfoBlog(blogReport.idBloged);
                    blogReport.titleBlog = infoBlog.title;
                    blogReport.contentBlog = infoBlog.content;
                    var infoUserBlog = await GetInfoUser(infoBlog.idAccount);
                    blogReport.accountBloged = infoUserBlog.Id;
                    blogReport.emailBloged = infoUserBlog.email;
                    blogReport.nameBloged = infoUserBlog.fullName;
                    blogReport.avatarBloged = infoUserBlog.avatar;
                    blogReport.isVerifiedBloged = infoUserBlog.isVerified;
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

        [HttpPut("AcceptBlogReport/{idBlogReport}/{status}")]
        public async Task<Response> AcceptBlogReport(Guid idBlogReport, Status status)
        {
            var blogReport = await _context.BlogReports.FirstOrDefaultAsync(x => x.idBlogReport == idBlogReport);
            if (blogReport != null)
            {
                if (status == Status.Accept)
                {
                    blogReport.status = Status.Accept;
                    blogReport.confirmedDate = DateTime.Now;
                    var isSuccess = await _context.SaveChangesAsync();
                    if (isSuccess > 0)
                    {
                        var blogCount = await _context.BlogReports.CountAsync(x => x.idBloged == blogReport.idBloged && x.status == Status.Accept);
                        if (blogCount > 4 && blogCount < 6)
                        {
                            await BlockBlog(blogReport.idBloged);
                        }
                        return new Response(HttpStatusCode.OK, "Accept report is success!", _mapper.Map<ViewBlogReport>(blogReport));
                    }
                    return new Response(HttpStatusCode.BadRequest, "Accept report is fail!");
                }
                else
                {
                    blogReport.status = Status.Deny;
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
