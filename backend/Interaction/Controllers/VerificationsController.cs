using BusinessObjects.Entities.Interaction;
using Interaction.DBContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
