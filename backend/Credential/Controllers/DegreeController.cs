using AutoMapper;
using BusinessObjects.Entities.Credential;
using BusinessObjects.ViewModels.Credential;
using Credential.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Credential.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DegreeController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;

        public DegreeController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("GetAllDegree")]
        public async Task<ActionResult<List<ViewDegree>>> GetAllDegree()
        {
            var degrees = await _context.Degrees.ToListAsync();
            if (degrees == null)
            {
                return NotFound("DEgree doesn't exists!");
            }
            return _mapper.Map<List<ViewDegree>>(degrees);
        }

        [HttpGet("GetDegreeByUser")]
        public async Task<ActionResult<ViewDegree>> GetDegreeByUser(Guid userId)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idAccount == userId);
            if (degree == null)
            {
                return NotFound("Degree doesn't exists!");
            }
            return _mapper.Map<ViewDegree>(degree);
        }

        [HttpGet("GetDegreeById/{degreeId}")]
        public async Task<ActionResult<ViewDegree>> GetDegree(Guid degreeId)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == degreeId);
            if (degree == null)
            {
                return NotFound("Degree doesn't exists!");
            }
            return _mapper.Map<ViewDegree>(degree);
        }

        [HttpPost("CreateDegree")]
        public async Task<ActionResult<ViewDegree>> CreateDegree(CreateDegree degreeDTO)
        {
            var degree = _mapper.Map<Degree>(degreeDTO);
            await _context.Degrees.AddAsync(degree);
            await _context.SaveChangesAsync();
            return _mapper.Map<ViewDegree>(degree);
        }

        [HttpPut("UpdateDegree")]
        public async Task<ActionResult<ViewDegree>> UpdateDegree(Guid degreeId, UpdateDegree degreeDTO)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == degreeId);
            if (degree == null)
            {
                return NotFound("Degree doesn't exists!");
            }
            _mapper.Map(degreeDTO, degree);
            _context.Degrees.Update(degree);
            await _context.SaveChangesAsync();
            return _mapper.Map<ViewDegree>(degree);
        }

        [HttpDelete("RemoveDegree")]
        public async Task<IActionResult> RemoveDegree(Guid degreeId)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == degreeId);
            if (degree == null)
            {
                return NotFound("Degree doesn't exists!");
            }
            _context.Degrees.Remove(degree);
            await _context.SaveChangesAsync();
            return Ok("Remove Degree successfullt!");
        }
    }
}
