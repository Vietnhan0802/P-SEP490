using BusinessObjects.Entities.Interaction;
using Interaction.DBContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
