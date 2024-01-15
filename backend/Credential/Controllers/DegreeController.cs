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

        
        [HttpGet("GetNameUserCurrent/{idUser}")]
        private async Task<string> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
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

            var result = _mapper.Map<List<ViewDegree>>(degrees);
            foreach (var degree in result)
            {
                degree.idAccount = await GetNameUserCurrent(degree.idAccount);
            }

            return new Response(HttpStatusCode.OK, "Get all degree success!", result);
        }

        [HttpGet("GetDegreeByUser/{idUser}")]
        public async Task<Response> GetDegreeByUser(string idUser)
        {
            var degrees = await _context.Degrees.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderBy(x => x.createdDate).AsNoTracking().ToListAsync();
            if (degrees == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }

            var result = _mapper.Map<List<ViewDegree>>(degrees);
            foreach (var degree in result)
            {
                degree.idAccount = await GetNameUserCurrent(idUser);
            }

            return new Response(HttpStatusCode.OK, "Get degree by user success!", result);
        }

        [HttpGet("GetDegreeById/{idDegree}")]
        public async Task<Response> GetDegreeById(Guid idDegree)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == idDegree);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }

            var userName = await GetNameUserCurrent(degree.idAccount);
            degree.idAccount = userName;

            return new Response(HttpStatusCode.OK, "Get degree by is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpPost("CreateDegree/{idUser}")]
        public async Task<Response> CreateDegree(string idUser, CreateDegree degreeDTO)
        {
            var degree = _mapper.Map<Degree>(degreeDTO);
            degree.idAccount = idUser;
            degree.isDeleted = false;
            degree.createdDate = DateTime.Now;
            await _context.Degrees.AddAsync(degree);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Create degree is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpPut("UpdateDegree/{idDegree}")]
        public async Task<Response> UpdateDegree(Guid idDegree, UpdateDegree degreeDTO)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == idDegree);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }

            _mapper.Map(degreeDTO, degree);
            _context.Degrees.Update(degree);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Update degree is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpDelete("RemoveDegree/{idDegree}")]
        public async Task<Response> RemoveDegree(Guid idDegree)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == idDegree);
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
