﻿using AutoMapper;
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
        public async Task<Response> GetAllVerification(Status status)
        {
            var verifications = await _context.Verifications.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (verifications.Count > 0)
            {
                if (status == Status.Waiting)
                {
                    verifications = verifications.Where(x => x.status == Status.Waiting).ToList();
                }
                else if (status == Status.Accept)
                {
                    verifications = verifications.Where(x => x.status == Status.Accept).ToList();
                }
                else if (status == Status.Deny)
                {
                    verifications = verifications.Where(x => x.status == Status.Deny).ToList();
                }
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
            if (ModelState.IsValid)
            {
                Verification verification = new Verification()
                {
                    idAccount = idUser,
                    status = Status.Waiting,
                    createdDate = DateTime.Now
                };
                await _context.Verifications.AddAsync(verification);
                await _context.SaveChangesAsync();
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
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewVerification>(verification));
            }
            else
            {
                return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
            }
        }

        /*------------------------------------------------------------AccountReport------------------------------------------------------------*/

        /*[HttpGet("GetAllAccountReport")]
        public async Task<Response> GetAllAccountReport(Status status)
        {
            var accountReports = await _context.AccountReports.OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (accountReports.Count > 0)
            {
                if (status)
            }
        }*/

        [HttpGet("GetAllAccountReportsWaiting")]
        public async Task<Response> GetAllAccountReportsWaiting()
        {
            var accountReports = await _context.AccountReports.Where(x => x.status == Status.Waiting).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (accountReports == null)
            {
                return new Response(HttpStatusCode.NoContent, "Account report doesn't empty!");
            }
            var result = _mapper.Map<List<ViewAccountReport>>(accountReports);
            foreach (var accountReport in result)
            {
                var infoReporter = await GetNameUserCurrent(accountReport.idReporter!);
                accountReport.nameReporter = infoReporter.fullName;
                var infoReported = await GetNameUserCurrent(accountReport.idReported!);
                accountReport.nameReported = infoReported.fullName;
            }
            return new Response(HttpStatusCode.OK, "Getall account report is success!", result);
        }

        [HttpGet("GetAllAccountReportsAcceptOrDeny")]
        public async Task<Response> GetAllAccountReportsAcceptOrDeny()
        {
            var accountReports = await _context.AccountReports.Where(x => x.status == Status.Accept || x.status == Status.Deny).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (accountReports == null)
            {
                return new Response(HttpStatusCode.NoContent, "Account report doesn't empty!");
            }
            var result = _mapper.Map<List<ViewAccountReport>>(accountReports);
            foreach (var accountReport in result)
            {
                var infoReporter = await GetNameUserCurrent(accountReport.idReporter!);
                accountReport.nameReporter = infoReporter.fullName;
                var infoReported = await GetNameUserCurrent(accountReport.idReported!);
                accountReport.nameReported = infoReported.fullName;
            }
            return new Response(HttpStatusCode.OK, "Getall account report is success!", result);
        }

        [HttpPost("CreateAccountReport/{idReporter}/{idReported}/{content}")]
        public async Task<Response> CreateAccountReport(string idReporter, string idReported, string content)
        {
            if (ModelState.IsValid)
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
                await _context.SaveChangesAsync();
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
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewAccountReport>(accountReport));
            }
            else
            {
                return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
            }
        }

        /*------------------------------------------------------------PostReport------------------------------------------------------------*/

        [HttpGet("GetAllPostReportsAccept")]
        public async Task<int> GetAllPostReportsAccept()
        {
            var postReports = await _context.PostReports.Where(x => x.status == Status.Accept).CountAsync();
            return postReports;
        }

        [HttpGet("GetAllPostReportsWaiting")]
        public async Task<Response> GetAllPostReportsWaiting()
        {
            var postReports = await _context.PostReports.Where(x => x.status == Status.Waiting).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (postReports == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post report doesn't empty!");
            }
            var result = _mapper.Map<List<ViewPostReport>>(postReports);
            foreach (var postReport in result)
            {
                var infoUser =  await GetNameUserCurrent(postReport.idReporter!);
                postReport.idReporter = infoUser.fullName;
            }
            return new Response(HttpStatusCode.OK, "Getall post report is success!", result);
        }

        [HttpGet("GetAllPostReportsAcceptOrDeny")]
        public async Task<Response> GetAllPostReportsAcceptOrDeny()
        {
            var postReports = await _context.PostReports.Where(x => x.status == Status.Accept || x.status == Status.Deny).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (postReports == null)
            {
                return new Response(HttpStatusCode.NoContent, "Post report doesn't empty!");
            }
            var result = _mapper.Map<List<ViewPostReport>>(postReports);
            foreach (var postReport in result)
            {
                var infoUser = await GetNameUserCurrent(postReport.idReporter!);
                postReport.idReporter = infoUser.fullName;
            }
            return new Response(HttpStatusCode.OK, "Getall post report is success!", result);
        }

        [HttpPost("CreatePostReport/{idReporter}/{idPosted}/{content}")]
        public async Task<Response> CreatePostReport(string idReporter, Guid idPosted, string content)
        {
            if (ModelState.IsValid)
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
                await _context.SaveChangesAsync();
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
            else
            {
                return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
            }
        }

        /*------------------------------------------------------------BlogReport------------------------------------------------------------*/

        [HttpGet("GetAllBlogReportsAccept")]
        public async Task<int> GetAllBlogReportsAccept()
        {
            var blogReports = await _context.BlogReports.Where(x => x.status == Status.Accept).CountAsync();
            return blogReports;
        }

        [HttpGet("GetAllBlogReportsWaiting")]
        public async Task<Response> GetAllBlogReportsWaiting()
        {
            var blogReports = await _context.BlogReports.Where(x => x.status == Status.Waiting).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogReports == null)
            {
                return new Response(HttpStatusCode.NoContent, "Blog report doesn't empty!");
            }
            var result = _mapper.Map<List<ViewBlogReport>>(blogReports);
            foreach (var blogReport in result)
            {
                var infoUser = await GetNameUserCurrent(blogReport.idReporter!);
                blogReport.idReporter = infoUser.fullName;
            }
            return new Response(HttpStatusCode.OK, "Getall blog report is success!", result);
        }

        [HttpGet("GetAllBlogReportsAcceptOrDeny")]
        public async Task<Response> GetAllBlogReportsAcceptOrDeny()
        {
            var blogReports = await _context.BlogReports.Where(x => x.status == Status.Accept || x.status == Status.Deny).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (blogReports == null)
            {
                return new Response(HttpStatusCode.NoContent, "Blog report doesn't empty!");
            }
            var result = _mapper.Map<List<ViewBlogReport>>(blogReports);
            foreach (var blogReport in result)
            {
                var infoUser = await GetNameUserCurrent(blogReport.idReporter!);
                blogReport.idReporter = infoUser.fullName;
            }
            return new Response(HttpStatusCode.OK, "Getall blog report is success!", result);
        }

        [HttpPost("CreateBlogReport/{idReporter}/{idBloged}/{content}")]
        public async Task<Response> CreateBlogReport(string idReporter, Guid idBloged, string content)
        {
            if (ModelState.IsValid)
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
                await _context.SaveChangesAsync();
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
            else
            {
                return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
            }
        }
    }
}
