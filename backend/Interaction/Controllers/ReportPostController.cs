using BusinessObjects.Entities.Interaction;
using Interaction.DBContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    public class ReportPostController : ControllerBase
    {
        private readonly VerificationDbContext _context;

        public ReportPostController(VerificationDbContext context)
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
