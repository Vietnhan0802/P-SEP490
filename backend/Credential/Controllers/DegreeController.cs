using AutoMapper;
using BusinessObjects.Entities.Credential;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.User;
using Credential.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Credential.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DegreeController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;
        public string UserApiUrl { get; }

        public DegreeController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        
        [HttpGet("GetCurrentUserByName/{userId}")]
        private async Task<string> GetCurrentUserByName(string userId)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{userId}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<string>(strData, option);

            return user;
        }

        [HttpGet("GetAllDegree")]
        public async Task<Response> GetAllDegree()
        {
            var degrees = await _context.Degrees.ToListAsync();
            if (degrees == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            return new Response(HttpStatusCode.OK, "Get all degree success!", _mapper.Map<List<ViewDegree>>(degrees));
        }

        [HttpGet("GetDegreeByUser/{userId}")]
        public async Task<Response> GetDegreeByUser(string userId)
        {
            var userName = await GetCurrentUserByName(userId);

            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idAccount == userId);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            var result = _mapper.Map<ViewDegree>(degree);
            result.idAccount = userName;
            return new Response(HttpStatusCode.OK, "Get degree by user success!", result);
        }

        [HttpGet("GetDegreeById/{degreeId}")]
        public async Task<Response> GetDegreeById(Guid degreeId)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == degreeId);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            var userId = degree.idAccount;
            var userName = await GetCurrentUserByName(userId);
            degree.idAccount = userName;
            return new Response(HttpStatusCode.OK, "Get degree by is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpPost("CreateDegree/{idAccount}")]
        public async Task<Response> CreateDegree(string idAccount, CreateDegree degreeDTO)
        {
            var degree = _mapper.Map<Degree>(degreeDTO);
            degree.idAccount = idAccount;
            degree.isDeleted = false;
            degree.createdDate = DateTime.Now;
            await _context.Degrees.AddAsync(degree);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create degree is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpPut("UpdateDegree/{degreeId}")]
        public async Task<Response> UpdateDegree(Guid degreeId, UpdateDegree degreeDTO)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == degreeId);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            _mapper.Map(degreeDTO, degree);
            _context.Degrees.Update(degree);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update degree is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpDelete("RemoveDegree/{degreeId}")]
        public async Task<Response> RemoveDegree(Guid degreeId)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == degreeId);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            degree.isDeleted = true;
            _context.Degrees.Update(degree);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove Degree successfullt!");
        }
    }
}
