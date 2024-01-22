using BusinessObjects.Entities.Interaction;
using Interaction.DBContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    public class InteractionController : ControllerBase
    {
        private readonly VerificationDbContext _context;

        public InteractionController(VerificationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReportPost>>> GetReportPosts()
        {
            return await _context.ReportPosts.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReportPost>> GetReportPost(Guid id)
        {
            var reportPost = await _context.ReportPosts.FindAsync(id);
            if (reportPost == null)
            {
                return NotFound();
            }
            return reportPost;
        }

        [HttpPost]
        public async Task<ActionResult<ReportPost>> CreateReportPost(ReportPost reportPost)
        {
            reportPost.Id = Guid.NewGuid();
            reportPost.CreatedDate = DateTime.Now;

            _context.ReportPosts.Add(reportPost);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetReportPost),
                new { id = reportPost.Id },
                reportPost);
        }

        [HttpPut("{id}/accept")]
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

        [HttpPut("{id}/deny")]
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

        [HttpGet("searchByContent/{searchTerm}")]
        public async Task<ActionResult<List<ReportPost>>> SearchReportPostsByContent(string searchTerm)
        {
            var reportPosts = await _context.ReportPosts
                .Where(rp => rp.Content.Contains(searchTerm))
                .ToListAsync();

            return reportPosts;
        }

        [HttpGet("status/true")]
        public async Task<ActionResult<IEnumerable<ReportPost>>> GetTrueReportPosts()
        {
            var trueReportPosts = await _context.ReportPosts
                .Where(rp => rp.IsAccepted == true)
                .ToListAsync();

            return trueReportPosts;
        }

        [HttpGet("status/false")]
        public async Task<ActionResult<IEnumerable<ReportPost>>> GetFalseReportPosts()
        {
            var falseReportPosts = await _context.ReportPosts
                .Where(rp => rp.IsAccepted == false)
                .ToListAsync();

            return falseReportPosts;
        }

        [HttpGet("status/null")]
        public async Task<ActionResult<IEnumerable<ReportPost>>> GetNullReportPosts()
        {
            var nullReportPosts = await _context.ReportPosts
                .Where(rp => rp.IsAccepted == null)
                .ToListAsync();

            return nullReportPosts;
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

        public VerificationsController(VerificationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Verification>>> GetVerifications()
        {
            return await _context.Verifications.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Verification>> GetVerification(Guid id)
        {
            var verification = await _context.Verifications.FindAsync(id);

            if (verification == null)
            {
                return NotFound();
            }

            return verification;
        }
        [HttpPut("{id}/accept")]
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
        [HttpPut("{id}/deny")]
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
        [HttpPost]
        public async Task<ActionResult<Verification>> AddVerification([FromBody] Verification newVerification)
        {
            if (newVerification == null)
            {
                return BadRequest();
            }

            newVerification.Id = Guid.NewGuid();
            newVerification.IsAccept = null;  // Mặc định là null khi tạo mới

            _context.Verifications.Add(newVerification);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVerification), new { id = newVerification.Id }, newVerification);
        }

        [HttpGet("null")]
        public async Task<ActionResult<IEnumerable<Verification>>> GetNullVerifications()
        {
            var nullVerifications = await _context.Verifications
                .Where(v => v.IsAccept == null)
                .ToListAsync();

            return nullVerifications;
        }

        [HttpGet("false")]
        public async Task<ActionResult<IEnumerable<Verification>>> GetFalseVerifications()
        {
            var falseVerifications = await _context.Verifications
                .Where(v => v.IsAccept == false)
                .ToListAsync();

            return falseVerifications;
        }

        [HttpGet("true")]
        public async Task<ActionResult<IEnumerable<Verification>>> GetTrueVerifications()
        {
            var trueVerifications = await _context.Verifications
                .Where(v => v.IsAccept == true)
                .ToListAsync();

            return trueVerifications;
        }
    }
}

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    public class AccountReportController : ControllerBase
    {
        private readonly VerificationDbContext _context;

        public AccountReportController(VerificationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<AccountReport>>> GetAccountReports()
        {
            return await _context.AccountReports.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountReport>> GetAccountReport(Guid id)
        {
            var accountReport = await _context.AccountReports.FindAsync(id);
            if (accountReport == null)
            {
                return NotFound();
            }
            return accountReport;
        }

        [HttpPost]
        public async Task<ActionResult<AccountReport>> CreateAccountReport(AccountReport accountReport)
        {
            accountReport.Id = Guid.NewGuid();
            accountReport.CreatedDate = DateTime.Now;

            _context.AccountReports.Add(accountReport);
            await _context.SaveChangesAsync();

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

            return accountReports;
        }

        [HttpGet("status/true")]
        public async Task<ActionResult<IEnumerable<AccountReport>>> GetTrueAccountReports()
        {
            var trueAccountReports = await _context.AccountReports
                .Where(ar => ar.IsAccepted == true)
                .ToListAsync();

            return trueAccountReports;
        }

        [HttpGet("status/false")]
        public async Task<ActionResult<IEnumerable<AccountReport>>> GetFalseAccountReports()
        {
            var falseAccountReports = await _context.AccountReports
                .Where(ar => ar.IsAccepted == false)
                .ToListAsync();

            return falseAccountReports;
        }

        [HttpGet("status/null")]
        public async Task<ActionResult<IEnumerable<AccountReport>>> GetNullAccountReports()
        {
            var nullAccountReports = await _context.AccountReports
                .Where(ar => ar.IsAccepted == null)
                .ToListAsync();

            return nullAccountReports;
        }
    }
}