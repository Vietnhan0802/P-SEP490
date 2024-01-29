using BusinessObjects.Entities.Interaction;
using BusinessObjects.ViewModels.User;
using Interaction.DBContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    public class VerificationsController : ControllerBase
    {
        private readonly VerificationDbContext _context;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public VerificationsController(VerificationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));

            client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            UserApiUrl = "https://localhost:7006/api/User";
        }

        private async Task<string> GetIdAccountById(string userId)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{userId}");

            if (!response.IsSuccessStatusCode)
            {
                // Handle the error or return a default value
                return "Unknown User";
            }

            string userData = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };

            var IdAccount = JsonSerializer.Deserialize<string>(userData, options);

            return IdAccount;
        }

        [HttpGet("GetAllReportPosts")]
        public async Task<Response> GetAllReportPosts()
        {
            var reportPosts = await _context.ReportPosts.ToListAsync();

            foreach (var reportPost in reportPosts)
            {
                reportPost.ReporterId = await GetIdAccountById(reportPost.ReporterId);
            }

            return new Response(HttpStatusCode.OK, "Get all Report Posts Successfully!", reportPosts);
        }

        [HttpGet("GetReportPost/{id}")]
        public async Task<ActionResult<ReportPost>> GetReportPost(Guid id)
        {
            var reportPost = await _context.ReportPosts.FindAsync(id);

            if (reportPost == null)
            {
                return NotFound();
            }

            reportPost.ReporterId = await GetIdAccountById(reportPost.ReporterId);

            return reportPost;
        }

        [HttpPost("CreateReportPost")]
        public async Task<ActionResult<ReportPost>> CreateReportPost(ReportPost reportPost)
        {
            reportPost.Id = Guid.NewGuid();
            reportPost.CreatedDate = DateTime.Now;

            _context.ReportPosts.Add(reportPost);
            await _context.SaveChangesAsync();

            var reporterName = await GetIdAccountById(reportPost.ReporterId);

            reportPost.ReporterId = reporterName;

            return CreatedAtAction(
                nameof(GetReportPost),
                new { id = reportPost.Id },
                reportPost);
        }

        [HttpPut("AcceptReportPost/{id}")]
        public async Task<IActionResult> AcceptReportPost(Guid id)
        {
            var reportPost = await _context.ReportPosts.FindAsync(id);

            if (reportPost == null)
            {
                return NotFound();
            }

            reportPost.IsAccepted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("DenyReportPost/{id}")]
        public async Task<IActionResult> DenyReportPost(Guid id)
        {
            var reportPost = await _context.ReportPosts.FindAsync(id);

            if (reportPost == null)
            {
                return NotFound();
            }

            reportPost.IsAccepted = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("SearchReportPostsByContent/{searchTerm}")]
        public async Task<ActionResult<List<ReportPost>>> SearchReportPostsByContent(string searchTerm)
        {
            var reportPosts = await _context.ReportPosts
                .Where(rp => rp.Content.Contains(searchTerm))
                .ToListAsync();

            foreach (var reportPost in reportPosts)
            {
                reportPost.ReporterId = await GetIdAccountById(reportPost.ReporterId);
            }

            return reportPosts;
        }

        [HttpGet("GetAcceptedReportPosts")]
        public async Task<ActionResult<IEnumerable<ReportPost>>> GetAcceptedReportPosts()
        {
            var acceptedReportPosts = await _context.ReportPosts
                .Where(rp => rp.IsAccepted == true)
                .ToListAsync();

            foreach (var reportPost in acceptedReportPosts)
            {
                reportPost.ReporterId = await GetIdAccountById(reportPost.ReporterId);
            }

            return acceptedReportPosts;
        }

        [HttpGet("GetRejectedReportPosts")]
        public async Task<ActionResult<IEnumerable<ReportPost>>> GetRejectedReportPosts()
        {
            var rejectedReportPosts = await _context.ReportPosts
                .Where(rp => rp.IsAccepted == false)
                .ToListAsync();

            foreach (var reportPost in rejectedReportPosts)
            {
                reportPost.ReporterId = await GetIdAccountById(reportPost.ReporterId);
            }

            return rejectedReportPosts;
        }

        [HttpGet("GetPendingReportPosts")]
        public async Task<ActionResult<IEnumerable<ReportPost>>> GetPendingReportPosts()
        {
            var pendingReportPosts = await _context.ReportPosts
                .Where(rp => rp.IsAccepted == null)
                .ToListAsync();

            foreach (var reportPost in pendingReportPosts)
            {
                reportPost.ReporterId = await GetIdAccountById(reportPost.ReporterId);
            }

            return pendingReportPosts;
        }
    }
}




namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerificationsController : ControllerBase
    {
        private readonly VerificationDbContext _context;
        private readonly HttpClient _client;

        public string UserApiUrl { get; }

        public VerificationsController(VerificationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            UserApiUrl = "https://localhost:7006/api/User";
        }

        private async Task<string> GetIdAccountById(string userId)
        {
            HttpResponseMessage response = await _client.GetAsync($"{UserApiUrl}/GetNameUser/{userId}");

            if (!response.IsSuccessStatusCode)
            {
                return "Unknown User";
            }

            string userData = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };

            var IdAccount = JsonSerializer.Deserialize<string>(userData, options);

            return IdAccount;
        }

        [HttpGet("GetAllVerifications")]
        public async Task<Response> GetAllVerifications()
        {
            var verifications = await _context.Verifications.ToListAsync();

            foreach (var verification in verifications)
            {
                verification.IdAccount = await GetIdAccountById(verification.IdAccount);
            }

            return new Response(HttpStatusCode.OK, "Get all Verifications Successfully!", verifications);
        }

        [HttpGet("GetVerification/{id}")]
        public async Task<ActionResult<Verification>> GetVerification(Guid id)
        {
            var verification = await _context.Verifications.FindAsync(id);

            if (verification == null)
            {
                return NotFound();
            }

            verification.IdAccount = await GetIdAccountById(verification.IdAccount);

            return verification;
        }

        [HttpPost("CreateVerification")]
        public async Task<ActionResult<Verification>> CreateVerification(Verification newVerification)
        {
            if (newVerification == null)
            {
                return BadRequest();
            }

            newVerification.Id = Guid.NewGuid();
            newVerification.IsAccept = null; 

            _context.Verifications.Add(newVerification);
            await _context.SaveChangesAsync();

            newVerification.IdAccount = await GetIdAccountById(newVerification.IdAccount);

            return CreatedAtAction(
                nameof(GetVerification),
                new { id = newVerification.Id },
                newVerification);
        }

        [HttpPut("AcceptVerification/{id}")]
        public async Task<IActionResult> AcceptVerification(Guid id)
        {
            var verification = await _context.Verifications.FindAsync(id);

            if (verification == null)
            {
                return NotFound();
            }

            verification.IsAccept = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("DenyVerification/{id}")]
        public async Task<IActionResult> DenyVerification(Guid id)
        {
            var verification = await _context.Verifications.FindAsync(id);

            if (verification == null)
            {
                return NotFound();
            }

            verification.IsAccept = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("GetNullVerifications")]
        public async Task<ActionResult<IEnumerable<Verification>>> GetNullVerifications()
        {
            var nullVerifications = await _context.Verifications
                .Where(v => v.IsAccept == null)
                .ToListAsync();

            foreach (var verification in nullVerifications)
            {
                verification.IdAccount = await GetIdAccountById(verification.IdAccount);
            }

            return nullVerifications;
        }

        [HttpGet("GetFalseVerifications")]
        public async Task<ActionResult<IEnumerable<Verification>>> GetFalseVerifications()
        {
            var falseVerifications = await _context.Verifications
                .Where(v => v.IsAccept == false)
                .ToListAsync();

            foreach (var verification in falseVerifications)
            {
                verification.IdAccount = await GetIdAccountById(verification.IdAccount);
            }

            return falseVerifications;
        }

        [HttpGet("GetTrueVerifications")]
        public async Task<ActionResult<IEnumerable<Verification>>> GetTrueVerifications()
        {
            var trueVerifications = await _context.Verifications
                .Where(v => v.IsAccept == true)
                .ToListAsync();

            foreach (var verification in trueVerifications)
            {
                verification.IdAccount = await GetIdAccountById(verification.IdAccount);
            }

            return trueVerifications;
        }
        [HttpGet("GetVerificationsCountByDay")]
        public async Task<ActionResult<int>> GetVerificationsCountByDay()
        {
            DateTime today = DateTime.Now.Date;
            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date == today)
                .CountAsync();

            return count;
        }

        [HttpGet("GetVerificationsCountByWeek")]
        public async Task<ActionResult<int>> GetVerificationsCountByWeek()
        {
            DateTime today = DateTime.Now.Date;
            DateTime startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            DateTime endOfWeek = startOfWeek.AddDays(6);

            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date >= startOfWeek && v.CreatedDate.Date <= endOfWeek)
                .CountAsync();

            return count;
        }

        [HttpGet("GetVerificationsCountByMonth")]
        public async Task<ActionResult<int>> GetVerificationsCountByMonth()
        {
            DateTime today = DateTime.Now.Date;
            DateTime startOfMonth = new DateTime(today.Year, today.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date >= startOfMonth && v.CreatedDate.Date <= endOfMonth)
                .CountAsync();

            return count;
        }
        [HttpGet("GetUnverifiedVerificationsCountByDay")]
        public async Task<ActionResult<int>> GetUnverifiedVerificationsCountByDay()
        {
            DateTime today = DateTime.Now.Date;
            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date == today && v.IsAccept == null)
                .CountAsync();

            return count;
        }

        [HttpGet("GetUnverifiedVerificationsCountByWeek")]
        public async Task<ActionResult<int>> GetUnverifiedVerificationsCountByWeek()
        {
            DateTime today = DateTime.Now.Date;
            DateTime startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            DateTime endOfWeek = startOfWeek.AddDays(6);

            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date >= startOfWeek && v.CreatedDate.Date <= endOfWeek && v.IsAccept == null)
                .CountAsync();

            return count;
        }

        [HttpGet("GetUnverifiedVerificationsCountByMonth")]
        public async Task<ActionResult<int>> GetUnverifiedVerificationsCountByMonth()
        {
            DateTime today = DateTime.Now.Date;
            DateTime startOfMonth = new DateTime(today.Year, today.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date >= startOfMonth && v.CreatedDate.Date <= endOfMonth && v.IsAccept == null)
                .CountAsync();

            return count;
        }
        [HttpGet("GetVerifiedVerificationsCountByDay")]
        public async Task<ActionResult<int>> GetVerifiedVerificationsCountByDay()
        {
            DateTime today = DateTime.Now.Date;
            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date == today && v.IsAccept == true)
                .CountAsync();

            return count;
        }

        [HttpGet("GetVerifiedVerificationsCountByWeek")]
        public async Task<ActionResult<int>> GetVerifiedVerificationsCountByWeek()
        {
            DateTime today = DateTime.Now.Date;
            DateTime startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            DateTime endOfWeek = startOfWeek.AddDays(6);

            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date >= startOfWeek && v.CreatedDate.Date <= endOfWeek && v.IsAccept == true)
                .CountAsync();

            return count;
        }

        [HttpGet("GetVerifiedVerificationsCountByMonth")]
        public async Task<ActionResult<int>> GetVerifiedVerificationsCountByMonth()
        {
            DateTime today = DateTime.Now.Date;
            DateTime startOfMonth = new DateTime(today.Year, today.Month, 1);
            DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            int count = await _context.Verifications
                .Where(v => v.CreatedDate.Date >= startOfMonth && v.CreatedDate.Date <= endOfMonth && v.IsAccept == true)
                .CountAsync();

            return count;
        }
    }
}

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    public class AccountReportController : ControllerBase
    {
        private readonly VerificationDbContext _context;
        private readonly HttpClient _client;

        public string UserApiUrl { get; }

        public AccountReportController(VerificationDbContext context)
        {
            _context = context;
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            UserApiUrl = "https://localhost:7006/api/User";
        }

        private async Task<string> GetUserNameById(string userId)
        {
            HttpResponseMessage response = await _client.GetAsync($"{UserApiUrl}/GetNameUser/{userId}");

            if (!response.IsSuccessStatusCode)
            {
                return "Unknown User";
            }

            string userData = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };

            var userName = JsonSerializer.Deserialize<string>(userData, options);

            return userName;
        }

        [HttpGet]
        public async Task<ActionResult<List<AccountReport>>> GetAccountReports()
        {
            var accountReports = await _context.AccountReports.ToListAsync();

            foreach (var accountReport in accountReports)
            {
                accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);
            }

            return accountReports;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountReport>> GetAccountReport(Guid id)
        {
            var accountReport = await _context.AccountReports.FindAsync(id);
            if (accountReport == null)
            {
                return NotFound();
            }

            accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);

            return accountReport;
        }

        [HttpPost]
        public async Task<ActionResult<AccountReport>> CreateAccountReport(AccountReport accountReport)
        {
            accountReport.Id = Guid.NewGuid();
            accountReport.CreatedDate = DateTime.Now;

            _context.AccountReports.Add(accountReport);
            await _context.SaveChangesAsync();

            accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);

            return CreatedAtAction(
                nameof(GetAccountReport),
                new { id = accountReport.Id },
                accountReport);
        }

        [HttpPut("{id}/accept")]
        public async Task<IActionResult> AcceptAccountReport(Guid id)
        {
            var accountReport = await _context.AccountReports.FindAsync(id);
            if (accountReport == null)
            {
                return NotFound();
            }

            accountReport.IsAccepted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/deny")]
        public async Task<IActionResult> DenyAccountReport(Guid id)
        {
            var accountReport = await _context.AccountReports.FindAsync(id);
            if (accountReport == null)
            {
                return NotFound();
            }

            accountReport.IsAccepted = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("searchByContent/{searchTerm}")]
        public async Task<ActionResult<List<AccountReport>>> SearchAccountReportsByContent(string searchTerm)
        {
            var accountReports = await _context.AccountReports
              .Where(ar => ar.Content.Contains(searchTerm))
              .ToListAsync();

            foreach (var accountReport in accountReports)
            {
                accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);
            }

            return accountReports;
        }

        [HttpGet("status/true")]
        public async Task<ActionResult<IEnumerable<AccountReport>>> GetTrueAccountReports()
        {
            var trueAccountReports = await _context.AccountReports
                .Where(ar => ar.IsAccepted == true)
                .ToListAsync();

            foreach (var accountReport in trueAccountReports)
            {
                accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);
            }

            return trueAccountReports;
        }

        [HttpGet("status/false")]
        public async Task<ActionResult<IEnumerable<AccountReport>>> GetFalseAccountReports()
        {
            var falseAccountReports = await _context.AccountReports
                .Where(ar => ar.IsAccepted == false)
                .ToListAsync();

            foreach (var accountReport in falseAccountReports)
            {
                accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);
            }

            return falseAccountReports;
        }

        [HttpGet("status/null")]
        public async Task<ActionResult<IEnumerable<AccountReport>>> GetNullAccountReports()
        {
            var nullAccountReports = await _context.AccountReports
                .Where(ar => ar.IsAccepted == null)
                .ToListAsync();

            foreach (var accountReport in nullAccountReports)
            {
                accountReport.ReporterId = await GetUserNameById(accountReport.ReporterId);
            }

            return nullAccountReports;
        }
    }
}
